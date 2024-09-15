import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['en', 'ru'];
export type Locale = (typeof locales)[number];

export const localePrefix = 'as-needed';

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
  locales,
  localePrefix,
});
