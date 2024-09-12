import { ARRAY_METHODS } from '@/shared/constants';
import urlToRequestTransform from '@/utils/urlToRequestTransform';
import { describe, expect, it } from 'vitest';

describe('urlToRequestTransform', () => {
  it('should return the method and decoded URL when the format is correct', () => {
    const encodedUrl = `${ARRAY_METHODS[0]}/${encodeURIComponent(btoa('https://example.com'))}`;
    const result = urlToRequestTransform(encodedUrl);

    expect(result).toEqual({
      method: ARRAY_METHODS[0],
      url: 'https://example.com',
    });
  });

  it('should return null if the method is not found', () => {
    const encodedUrl = `UNKNOWN_METHOD/${encodeURIComponent(btoa('https://example.com'))}`;
    const result = urlToRequestTransform(encodedUrl);

    expect(result).toBeNull();
  });

  it('should return null if no path is found after the method', () => {
    const encodedUrl = `${ARRAY_METHODS[0]}/`;
    const result = urlToRequestTransform(encodedUrl);

    expect(result).toBeNull();
  });

  it('should return null if the URL is empty', () => {
    const encodedUrl = '';
    const result = urlToRequestTransform(encodedUrl);

    expect(result).toBeNull();
  });

  it('should return null if the URL is not correctly Base64 encoded', () => {
    const encodedUrl = 'notBase64EncodedUrl';
    const result = urlToRequestTransform(encodedUrl);

    expect(result).toBeNull();
  });
});
