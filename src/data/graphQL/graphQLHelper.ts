import { EditorContext } from "@graphiql/react";
import { URLSearchParams } from "url";
import { KeyValuePair } from '@/types&interfaces/types';
import { string } from "yup";

export type JSONValue =
    | string
    | number
    | boolean
    | JSONObject
    | JSONArray;

interface JSONObject {
    [x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> { }

export interface GraphQLQuery {
  url: string;
  query: string;
  queryVariables: string;
  //custom type for KeyForm component, otherwise would be just string/json
  headers?: KeyValuePair[];
}

export interface GraphQLApiResponse {
  // network and CORS error
  networkError?: Error; 
  status?: number;
  // JSON parse error
  errorMessage?: string;
  data?: JSONValue;
}

export function parseQueryFromPath(path:string[], searchParams?: URLSearchParams): GraphQLQuery | null {
  // [0] - base64(url)
  // [1] - base64(JSON(query: query, variables: queryVariables))
  // ?header=value1&header=value2
  try {
    if (path.length >= 2) {
      const url = atob(decodeURIComponent(path[0]))
      const bodyJSON = JSON.parse(atob(decodeURIComponent(path[1])))
      const query = bodyJSON.query;
      const queryVariables = bodyJSON.variables;
      let headers: KeyValuePair[] = [];
      if (searchParams) {
        headers = convertSearchParamsStringToKeyValuePairs(searchParams.toString())
      //   headers = [...searchParams.entries()]?.map(([key, value]) => 
      //     ({key, value, editable: false})
      //  );
      }

      return {url, query, queryVariables, headers}
    } else {
      return null
    }
  } catch {
    return null
  }

}

export function convertKeyValuePairsToSearchParamsString(pairs: KeyValuePair[]): string {
  const searchParamsString = pairs.map(({key, value}) => key+'='+value).join('&');
  return '?'+ encodeURIComponent(searchParamsString);
}

export function convertSearchParamsStringToKeyValuePairs(searchParamsString: string): KeyValuePair[] {
  const stringPairs = decodeURIComponent(searchParamsString.slice(1)).split('&');
  return stringPairs.map((pair) => { 
    const keyValueArray = pair.split('=');
    return {key: keyValueArray[0], value: keyValueArray[1], editable: false}
  })
}

// doing this weird shit becaue variables in our mock files are already JSON (in order to avoid escaping ""), so to avoid double JSON,stringify() on it :
export function composeGraphQLPostRequestBody(query: string, variables: string) {
  return JSON.stringify({ query, variables: JSON.parse(variables) });
  //return JSON.stringify({ query: query }).slice(0, -1) + `, "variables": ${variables} }`;
}

export function parseRequestHeadersString(headersString: string): Record<string, string> {
  const headerPairs = headersString.split(';');
  const headers: Record<string, string> = {};
  headerPairs.forEach((pair) => {
    const headerName = pair.split(':')[0];
    const headerValue = pair.split(':')[1];
    headers[headerName] = headerValue;
  });
  return headers;
}
