import { FC } from 'react';

import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export const GuestNav: FC = () => {
  const t = useTranslations('buttons');

  return (
    <>
      <Link href='/sign-up'>
        <Button variant='contained'>{t('sign-up')}</Button>
      </Link>
      <Link href='/sign-in'>
        <Button variant='contained' color='secondary' sx={{ color: '#000' }}>
          {t('sign-in')}
        </Button>
      </Link>
    </>
  );
};
