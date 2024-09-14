import transformStatusCodeToColor from '@/utils/transformStatusCodeToColor';
import { describe, expect, it } from 'vitest';

describe('transformStatusCodeToColor', () => {
  it('should return green color for valid status codes in the range 100-399', () => {
    const validStatusCodes = ['100', '200', '299', '399'];
    validStatusCodes.forEach((statusCode) => {
      expect(transformStatusCodeToColor(statusCode)).toBe('rgb(0, 255, 0)');
    });
  });

  it('should return red color for status codes outside the range 100-399', () => {
    const invalidStatusCodes = ['400', '500', '99', '0'];
    invalidStatusCodes.forEach((statusCode) => {
      expect(transformStatusCodeToColor(statusCode)).toBe('rgb(255, 0, 0)');
    });
  });

  it('should return red color for invalid or malformed status codes', () => {
    const malformedStatusCodes = ['null', 'undefined', 'NaN'];
    malformedStatusCodes.forEach((statusCode) => {
      expect(transformStatusCodeToColor(statusCode)).toBe('rgb(255, 0, 0)');
    });
  });
});
