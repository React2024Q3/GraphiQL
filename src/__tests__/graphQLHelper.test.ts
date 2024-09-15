import {
  GraphQLQuery,
  composeGraphQLRequestPostBody,
  composeStatePathFromQuery,
  convertKeyValuePairsToSearchParamsString,
  convertSearchParamsStringToKeyValuePairs,
  parseQueryFromPath,
  parseQueryUrlFromHistoryPath,
  shallowChangeUrlInBrowser,
} from '@/data/graphQL/graphQLHelper';
import { KeyValuePair } from '@/types&interfaces/types';
import { describe, expect, it, vi } from 'vitest';

describe('composeStatePathFromQuery', () => {
  it('should compose a valid path from query and editorVariables', () => {
    const query: GraphQLQuery = {
      url: 'https://example.com/graphql',
      query: '{ user { id, name } }',
      queryVariables: '{"id":1}',
    };
    const editorVariables: KeyValuePair[] = [{ key: 'id', value: '1', editable: false }];

    const path = composeStatePathFromQuery(query, editorVariables);

    expect(path).toContain(encodeURIComponent(btoa(query.url)));
    expect(path).toContain(
      encodeURIComponent(btoa('{"query":"{ user { id, name } }","variables":{"id":1}}'))
    );
  });
});

describe('parseQueryUrlFromHistoryPath', () => {
  it('should correctly decode a base64 encoded URL from the path', () => {
    const encodedUrl = encodeURIComponent(btoa('https://example.com/graphql'));
    const url = parseQueryUrlFromHistoryPath(`${encodedUrl}/some-other-part`);

    expect(url).toBe('https://example.com/graphql');
  });
});

describe('parseQueryFromPath', () => {
  it('should parse a valid GraphQLQuery from path and searchParams', () => {
    const path = [
      encodeURIComponent(btoa('https://example.com/graphql')),
      encodeURIComponent(btoa(JSON.stringify({ query: '{ user { id } }', variables: { id: 1 } }))),
    ];
    const searchParams = new URLSearchParams('Authorization=Bearer+token');

    const parsedQuery = parseQueryFromPath(path, searchParams);

    expect(parsedQuery).toEqual({
      url: 'https://example.com/graphql',
      query: '{ user { id } }',
      queryVariables: JSON.stringify({ id: 1 }),
      headers: [{ key: 'Authorization', value: 'Bearer+token', editable: false }],
    });
  });

  it('should return null if the path is invalid', () => {
    const path = ['invalid_path'];
    const result = parseQueryFromPath(path);

    expect(result).toBeNull();
  });

  it('should return null if JSON parsing fails', () => {
    const path = [
      encodeURIComponent(btoa('https://example.com/graphql')),
      encodeURIComponent(btoa('invalid_json')),
    ];

    const result = parseQueryFromPath(path);

    expect(result).toBeNull();
  });
});

describe('convertKeyValuePairsToSearchParamsString', () => {
  it('should correctly convert key-value pairs to a search params string', () => {
    const pairs: KeyValuePair[] = [
      { key: 'Authorization', value: 'Bearer token', editable: false },
    ];

    const searchParamsString = convertKeyValuePairsToSearchParamsString(pairs);

    expect(searchParamsString).toBe('?Authorization%3DBearer%20token');
  });
});

describe('convertSearchParamsStringToKeyValuePairs', () => {
  it('should correctly convert a search params string to key-value pairs', () => {
    const searchParamsString = 'Authorization=Bearer%20token';

    const keyValuePairs = convertSearchParamsStringToKeyValuePairs(searchParamsString);

    expect(keyValuePairs).toEqual([
      { key: 'Authorization', value: 'Bearer token', editable: false },
    ]);
  });
});

describe('composeGraphQLRequestPostBody', () => {
  it('should compose a valid GraphQL request body from query and variables', () => {
    const query = '{ user { id, name } }';
    const variables = '{"id":1}';

    const result = composeGraphQLRequestPostBody(query, variables);

    expect(result).toBe(JSON.stringify({ query: '{ user { id, name } }', variables: { id: 1 } }));
  });

  it('should throw if variables is invalid JSON', () => {
    const query = '{ user { id, name } }';
    const variables = 'invalid_json';

    expect(() => composeGraphQLRequestPostBody(query, variables)).toThrow();
  });
});

describe('shallowChangeUrlInBrowser', () => {
  it('should change the URL in the browser without reloading', () => {
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState').mockImplementation(() => {});
    const newUrl = '/new-url';
    shallowChangeUrlInBrowser(newUrl);

    expect(replaceStateSpy).toHaveBeenCalledWith(null, '', newUrl);
    replaceStateSpy.mockRestore();
  });
});
