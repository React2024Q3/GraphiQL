import { config } from '@/middleware';
import createMiddleware from 'next-intl/middleware';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-intl/middleware', () => ({
  default: vi.fn(),
}));

vi.mock('./navigation', () => ({
  locales: ['en', 'ru'],
  localePrefix: 'as-needed',
}));

describe('Middleware', () => {
  it('should call createMiddleware with correct parameters', () => {
    expect(createMiddleware).toHaveBeenCalledWith({
      locales: ['en', 'ru'],
      localePrefix: 'as-needed',
      defaultLocale: 'en',
    });
  });

  it('should have the correct matcher configuration', () => {
    expect(config.matcher).toEqual(['/((?!api|_next|.*\\..*).*)']);
  });
});
