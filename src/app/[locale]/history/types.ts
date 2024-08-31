// export type RequestsState = {
//   restfulRequests: Request[];
//   graphQlRequests: Request[];
// };

export type RequestType = {
  url: string;
  method: string;
  headers: string[];
  body: string;
  variables: string[];
  timestamp: number;
};

// type RestfulRequest = Request & {
// };

// type GraphQlRequest = Request & {
// };
