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

export interface GraphQLApiResponse {
  // network and CORS error
  networkError?: Error; 
  status?: number;
  // JSON parse error
  errorMessage?: string;
  data?: JSONValue;
}

//import { GraphQLQueryType } from './graphQLQueryType';
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
