'use client';

import { ChangeEvent } from 'react';

import { type Locale } from '@/navigation';
import { useLocale } from 'next-intl';

import { usePathname, useRouter } from '../../navigation';
import styles from './LanguageSelect.module.css';

export default function LanguageSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    router.push(pathname, { locale: e.target.value });
  };

  return (
    <div className={styles.lang}>
      <select value={locale} onChange={handleChange}>
        <option value='en'>Eng</option>
        <option value='ru'>Рус</option>
      </select>
    </div>
  );
}
