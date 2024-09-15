import { POST } from '@/app/api/GRAPHQL/[...encodedPath]/route';
import { NextRequest, NextResponse } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

type HttpHandler = (
  req: NextRequest,
  context: { params: { encodedPath: string[] } }
) => Promise<NextResponse>;

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockNextRequest = (url: string) =>
  ({
    url,
  }) as unknown as NextRequest;

const testHttpMethod = async (
  encodedPath: string[],
  searchParams: string,
  httpMethod: HttpHandler
) => {
  const req = mockNextRequest(`http://example.com?${searchParams}`);
  const params = { encodedPath };

  const mockResponse = {
    ok: true,
    status: 200,
    json: async () => ({ success: true }),
    headers: new Headers({
      'content-type': 'application/json',
    }),
  } as Response;

  mockFetch.mockResolvedValueOnce(mockResponse);

  const response = await httpMethod(req, { params });

  const responseData = await response.json();
  const responseStatus = response.status;
  const responseHeaders = response.headers;

  expect(responseStatus).toBe(200);
  expect(responseData).toEqual({ data: { success: true }, headers: expect.any(Object) });
  expect(responseHeaders.get('content-type')).toBe('application/json');
};

describe('HTTP Method Handlers', () => {
  it('should handle POST request', async () => {
    await testHttpMethod(
      ['aHR0cHM6Ly9leGFtcGxlLmNvbQ==', 'eyJrZXkiOiJ2YWx1In0='],
      'key=value',
      POST
    );
  });
});
