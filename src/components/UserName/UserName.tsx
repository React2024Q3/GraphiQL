'use client';

import { FC, useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { fetchUserName } from '@/firebase/utils';
import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { ErrorNotification } from '../ErrorNotification';
import ListLinks from '../ListLinks';
import { LoadingSkeleton } from '../LoadingSkeleton';
import styles from './UserName.module.css';
import { getWelcomeString } from './helpers';

export const UserName: FC = () => {
  const { user, loading, error } = useAuth();
  const [name, setName] = useState('');
  const [fetchUserNameError, setFetchUserNameError] = useState<Error | null>(null);
  const t = useTranslations('Home');

  const searchParams = useSearchParams();
  const previousRoute = searchParams.get('from') || '';

  useEffect(() => {
    try {
      fetchUserName(user, setName);
    } catch (err) {
      setFetchUserNameError(
        err instanceof Error ? err : new Error('An error occured while fetching user data')
      );
    }
  }, [user, loading]);

  return (
    <Box className={styles.container}>
      {loading ? (
        <LoadingSkeleton width='50%' />
      ) : (
        <Typography variant='h4'>
          {getWelcomeString(
            user,
            name,
            previousRoute,
            t('GreetingPartWelcome'),
            t('GreetingPartBack')
          )}
        </Typography>
      )}

      {loading ? <LoadingSkeleton width='60%' /> : <ListLinks isUser={!!user} />}

      <ErrorNotification error={error} />
      <ErrorNotification error={fetchUserNameError} />
    </Box>
  );
};
