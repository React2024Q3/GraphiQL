import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['en', 'ru'];
export type Locale = (typeof locales)[number];

// By setting it to 'as-needed', our default language (en) will not appear
// in our pathnames, but our other languages will. For example, the Russian
// version of our /home page will be accessed at /ru/home while our English
// page will be accessed at /home.
// alternative will be to use 'always' (Default value)
export const localePrefix = 'as-needed';

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
  locales,
  localePrefix,
});
