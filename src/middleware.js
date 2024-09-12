import createMiddleware from 'next-intl/middleware';

import { localePrefix, locales } from './navigation';

export default createMiddleware({
  locales,
  localePrefix,
  defaultLocale: 'en',
});

// only applies this middleware to files in the app directory. Match all pathnames except
// for if they start with `/api`, `/_next` or `/_vercel`, the ones containing a dot (e.g. `favicon.ico`)
// "/((?!api|_next|_vercel|.*\\..*).*)"
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
