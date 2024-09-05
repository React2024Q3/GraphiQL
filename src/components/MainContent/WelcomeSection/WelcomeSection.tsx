'use client';

import { FC, useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { fetchUserName } from '@/firebase/utils';
import { Box, Container, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { ErrorNotification } from '../../ErrorNotification';
import ListLinks from '../../ListLinks';
import { Loader } from '../../Loader';
import { LoadingSkeleton } from '../../LoadingSkeleton';
import styles from '../MainContent.module.css';
import { getWelcomeString } from './helpers';

export const WelcomeSection: FC = () => {
  const { user, loading, error } = useAuth();
  const [name, setName] = useState('');
  const [fetchUserNameError, setFetchUserNameError] = useState<Error | null>(null);
  const t = useTranslations('Home');

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
    <Box className={styles.welcome}>
      <Container className={styles.welcome__container}>
        <Box>
          {loading ? (
            <>
              <Loader />
              <LoadingSkeleton width='20rem' typographyVariant='h3' />
            </>
          ) : (
            <Typography variant='h3' fontWeight={700}>
              {getWelcomeString(user, name, t('GreetingPartWelcome'))}
            </Typography>
          )}

          {loading ? (
            <Box className={styles.button__skeletons}>
              <LoadingSkeleton className={styles.button__skeleton} variant='rounded' width='6rem' />
              <LoadingSkeleton className={styles.button__skeleton} variant='rounded' />
            </Box>
          ) : (
            <ListLinks isUser={!!user} />
          )}
        </Box>

        <Image
          className={styles.developers__photo}
          src='/main.png'
          alt='main page picture'
          width={546}
          height={414}
        />

        <ErrorNotification error={error} />
        <ErrorNotification error={fetchUserNameError} />
      </Container>
    </Box>
  );
};
