'use client';

import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { type Locale } from '@/navigation';
import { useLocale } from 'next-intl';

import { usePathname, useRouter } from '../../navigation';
import styles from './LanguageSelect.module.css';

export default function LanguageSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;

  const handleChange = (e: SelectChangeEvent<string>) => {
    router.push(pathname, { locale: e.target.value });
  };

  return (
    <FormControl size='small'>
      <Select
        className={styles.select}
        value={locale}
        onChange={(e) => handleChange(e)}
        data-testid='select-lang'
      >
        <MenuItem value='en'>Eng</MenuItem>
        <MenuItem value='ru'>Рус</MenuItem>
      </Select>
    </FormControl>
  );
}
