import { getSchema } from '@/data/serverActions/getSchema';
import { buildClientSchema, validateSchema } from 'graphql';
import { Mock, describe, expect, it, vi } from 'vitest';

global.fetch = vi.fn();

vi.mock('graphql', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getIntrospectionQuery: vi.fn(() => 'MOCK_INTROSPECTION_QUERY'),
    buildClientSchema: vi.fn(),
    validateSchema: vi.fn(),
  };
});

describe('getSchema', () => {
  const mockUrl = 'https://example.com/graphql';

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and return schema data on success', async () => {
    const mockIntrospectionData = { __schema: { types: [] } };
    (fetch as Mock).mockResolvedValueOnce({
      json: async () => ({ data: mockIntrospectionData }),
    });

    (buildClientSchema as Mock).mockReturnValueOnce({});
    (validateSchema as Mock).mockReturnValueOnce([]);

    const result = await getSchema(mockUrl);

    expect(fetch).toHaveBeenCalledWith(mockUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'MOCK_INTROSPECTION_QUERY' }),
    });

    expect(buildClientSchema).toHaveBeenCalledWith(mockIntrospectionData);
    expect(validateSchema).toHaveBeenCalledWith({});
    expect(result).toEqual(mockIntrospectionData);
  });

  it('should return null and log an error on fetch failure', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (fetch as Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await getSchema(mockUrl);

    expect(fetch).toHaveBeenCalled();
    expect(result).toBeNull();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching GraphQL schema:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
