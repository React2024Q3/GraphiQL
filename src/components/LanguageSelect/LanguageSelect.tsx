'use client';
import styles from './LanguageSelect.module.css';

import { useRouter, usePathname } from '../../navigation';
import { ChangeEvent } from 'react';

export default function LanguageChanger({ locale }: { locale: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    router.push(pathname, { locale: e.target.value });
  };

  return (
    <div className={styles.lang}>
      <select value={locale} onChange={handleChange}>
        <option value="en">Eng</option>
        <option value="ru">Рус</option>
      </select>
    </div>
  );
}
