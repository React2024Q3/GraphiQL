export interface GraphQLQueryType {
  url: string;
  query: string;
  queryVariables: Record<string, string>;
  headers?: string;
}
