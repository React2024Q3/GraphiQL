'use client';

import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { usePathname, useRouter } from '../../navigation';
import styles from './LanguageSelect.module.css';

export default function LanguageChanger({ locale }: { locale: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: SelectChangeEvent<string>) => {
    router.push(pathname, { locale: e.target.value });
  };

  return (
    <FormControl size='small'>
      <Select className={styles.select} value={locale} onChange={(e) => handleChange(e)}>
        <MenuItem value='en'>Eng</MenuItem>
        <MenuItem value='ru'>Рус</MenuItem>
      </Select>
    </FormControl>
  );
}
