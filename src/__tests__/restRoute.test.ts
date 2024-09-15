import { DELETE, GET, PATCH, POST, PUT } from '@/app/api/[method]/[...encodedUrl]/route';
import { NextRequest, NextResponse } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

type HttpHandler = (
  req: NextRequest,
  context: { params: { method: string; encodedUrl: string[] } }
) => Promise<NextResponse>;

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockNextRequest = (url: string) =>
  ({
    url,
  }) as unknown as NextRequest;

const testHttpMethod = async (
  method: string,
  encodedUrl: string[],
  query: string,
  httpMethod: HttpHandler
) => {
  const req = mockNextRequest(`http://example.com?${query}`);
  const params = { method, encodedUrl };

  const mockResponse = {
    ok: true,
    status: 200,
    json: async () => ({ success: true }),
    text: async () => 'Text response',
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
  it('should handle GET request', async () => {
    await testHttpMethod('GET', ['aHR0cHM6Ly9leGFtcGxlLmNvbQ==', ''], 'key=value', GET);
  });

  it('should handle POST request', async () => {
    await testHttpMethod(
      'POST',
      ['aHR0cHM6Ly9leGFtcGxlLmNvbQ==', 'eyJrZXkiOiJ2YWx1In0='],
      'key=value',
      POST
    );
  });

  it('should handle PUT request', async () => {
    await testHttpMethod('PUT', ['aHR0cHM6Ly9leGFtcGxlLmNvbQ==', ''], 'key=value', PUT);
  });

  it('should handle DELETE request', async () => {
    await testHttpMethod('DELETE', ['aHR0cHM6Ly9leGFtcGxlLmNvbQ==', ''], 'key=value', DELETE);
  });

  it('should handle PATCH request', async () => {
    await testHttpMethod('PATCH', ['aHR0cHM6Ly9leGFtcGxlLmNvbQ==', ''], 'key=value', PATCH);
  });
});
