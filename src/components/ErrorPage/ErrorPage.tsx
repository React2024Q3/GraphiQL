import { FC } from 'react';

import styles from '@/shared/styles/sharedStyles.module.css';
import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { ErrorPageProps } from './types';

export const ErrorPage: FC<ErrorPageProps> = ({ error }) => {
  const t = useTranslations();

  return (
    <Box className={styles.error__container}>
      <Typography variant='h4'>{t('errors.error-page-msg')}</Typography>
      {error && <Typography variant='subtitle1'>{error.message}</Typography>}
    </Box>
  );
};
