import { KeyValuePair } from '@/types&interfaces/types';
import transformVariables from '@/utils/transformVariables';
import { URLSearchParams } from 'url';

export type JSONValue = string | number | boolean | JSONObject | JSONArray;

interface JSONObject {
  [x: string]: JSONValue;
}

type JSONArray = JSONValue[];

export interface GraphQLQuery {
  url: string;
  query: string;
  queryVariables: string;
  //custom type for KeyForm component, otherwise would be just string/json:
  headers?: KeyValuePair[];
}

export interface GraphQLApiResponse {
  // network and CORS error:
  networkError?: Error;
  status?: number;
  // JSON parse error:
  errorMessage?: string;
  data?: JSONValue;
}

// to avoid refetching and remounting
export function shallowChangeUrlInBrowser(newUrl: string) {
  window.history.replaceState(null, '', newUrl);
}

export function composeStatePathFromQuery(
  query: GraphQLQuery,
  editorVariables: KeyValuePair[]
): string | null {
  try {
    const encodedUrl = encodeURIComponent(btoa(query.url));
    const encodedBody = encodeURIComponent(
      btoa(
        composeGraphQLRequestPostBody(
          transformVariables(query.query, editorVariables),
          transformVariables(query.queryVariables, editorVariables)
        )
      )
    );
    let path = encodedUrl + '/' + encodedBody;
    if (query.headers) {
      path += convertKeyValuePairsToSearchParamsString(query.headers);
    }
    return path;
  } catch {
    return null;
  }
}

export function parseQueryUrlFromHistoryPath(path: string) {
  // path.split('/')[0]:  base64(url)
  // ...
  const urlPart = path.split('/')[0];
  const url = atob(decodeURIComponent(urlPart));
  return url;
}

export function parseQueryFromPath(
  path: string[],
  searchParams?: URLSearchParams
): GraphQLQuery | null {
  // path[0]: base64(url)
  // path[1]: base64(JSON(query: query, variables: queryVariables))
  // searchParams: ?header=value1&header=value2
  try {
    if (path.length >= 2) {
      const url = atob(decodeURIComponent(path[0]));
      const bodyJSON = JSON.parse(atob(decodeURIComponent(path[1])));
      const query = bodyJSON.query;
      const queryVariables = JSON.stringify(bodyJSON.variables);
      let headers: KeyValuePair[] = [];
      if (searchParams) {
        headers = convertSearchParamsStringToKeyValuePairs(searchParams.toString());
      }
      return { url, query, queryVariables, headers };
    } else {
      return null;
    }
  } catch {
    return null;
  }
}

export function convertKeyValuePairsToSearchParamsString(pairs: KeyValuePair[]): string {
  const searchParamsString = pairs.map(({ key, value }) => key + '=' + value).join('&');
  return '?' + encodeURIComponent(searchParamsString);
}

export function convertSearchParamsStringToKeyValuePairs(
  searchParamsString: string
): KeyValuePair[] {
  const stringPairs = decodeURIComponent(searchParamsString).split('&');
  return stringPairs.map((pair) => {
    const keyValueArray = pair.split('=');
    return { key: keyValueArray[0], value: keyValueArray[1], editable: false };
  });
}

// variables in our mock files are already JSON (in order to avoid escaping ""), so to avoid double JSON,stringify() on it :
export function composeGraphQLRequestPostBody(query: string, variables: string) {
  return JSON.stringify({ query, variables: JSON.parse(variables) });
}
