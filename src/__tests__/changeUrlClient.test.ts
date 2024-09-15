import { Methods } from '@/types&interfaces/enums';
import { KeyValuePair } from '@/types&interfaces/types';
import changeUrlClient from '@/utils/changeUrlClient';
import { describe, expect, it, vi } from 'vitest';

globalThis.window = Object.create(window);
const mockReplaceState = vi.fn();
globalThis.window.history.replaceState = mockReplaceState;

describe('changeUrlClient', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create a correct URL with GET method and no body', () => {
    const url = 'https://example.com';
    const body = '';
    const keyValuePairsHeader: KeyValuePair[] = [];
    const result = changeUrlClient(Methods.GET, url, body, keyValuePairsHeader);

    expect(result).toBe(`GET/${encodeURIComponent(btoa(url))}`);
    expect(mockReplaceState).toHaveBeenCalledWith(null, '', `/${result}`);
  });

  it('should create a correct URL with POST method and body', () => {
    const url = 'https://example.com';
    const body = '{"key": "value"}';
    const keyValuePairsHeader: KeyValuePair[] = [];
    const result = changeUrlClient(Methods.POST, url, body, keyValuePairsHeader);

    expect(result).toBe(`POST/${encodeURIComponent(btoa(url))}/${encodeURIComponent(btoa(body))}`);
    expect(mockReplaceState).toHaveBeenCalledWith(null, '', `/${result}`);
  });

  it('should create a correct URL with headers', () => {
    const url = 'https://example.com';
    const body = '';
    const keyValuePairsHeader: KeyValuePair[] = [
      { key: 'Authorization', value: 'Bearer token', editable: false },
      { key: 'Content-Type', value: 'application/json', editable: false },
    ];
    const result = changeUrlClient(Methods.GET, url, body, keyValuePairsHeader);

    const encodedUrl = encodeURIComponent(btoa(url));
    const headerString = 'Authorization=Bearer%20token&Content-Type=application%2Fjson';
    expect(result).toBe(`GET/${encodedUrl}?${headerString}`);
    expect(mockReplaceState).toHaveBeenCalledWith(null, '', `/${result}`);
  });

  it('should create a correct URL with encoded characters in the path and headers', () => {
    const url = 'https://example.com/some/path';
    const body = 'data with / slashes';
    const keyValuePairsHeader: KeyValuePair[] = [
      { key: 'special/key', value: 'value', editable: false },
    ];
    const result = changeUrlClient(Methods.PUT, url, body, keyValuePairsHeader);

    const encodedUrl = encodeURIComponent(btoa(url));
    const encodedBody = encodeURIComponent(btoa(body));
    const headerString = 'special%2Fkey=value';
    expect(result).toBe(`PUT/${encodedUrl}/${encodedBody}?${headerString}`);
    expect(mockReplaceState).toHaveBeenCalledWith(null, '', `/${result}`);
  });

  it('should handle empty input values', () => {
    const url = '';
    const body = '';
    const keyValuePairsHeader: KeyValuePair[] = [];
    const result = changeUrlClient(Methods.DELETE, url, body, keyValuePairsHeader);

    expect(result).toBe(`DELETE/${encodeURIComponent(btoa(url))}`);
    expect(mockReplaceState).toHaveBeenCalledWith(null, '', `/${result}`);
  });
});
