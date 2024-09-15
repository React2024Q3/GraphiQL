'use client';

import { useEffect } from 'react';

import styles from '@/shared/styles/sharedStyles.module.css';
import { Box, Button, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  const t = useTranslations('errors');

  return (
    <Box className={styles.error__container}>
      <Typography variant='h4'>{t('errors.error-page-msg')}</Typography>
      <Button variant='contained' onClick={() => reset()}>
        {t('buttons.error-page')}
      </Button>
    </Box>
  );
}
