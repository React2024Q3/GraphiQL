'use client';

import { FC, useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { fetchUserName } from '@/firebase/utils';
import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslations } from 'next-intl';

import { ErrorNotification } from '../../ErrorNotification';
import ListLinks from '../../ListLinks';
import styles from '../MainContent.module.css';
import { getWelcomeString } from './helpers';

export const WelcomeSection: FC = () => {
  const { user } = useAuth();
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
  }, [user]);

  return (
    <Box className={styles.welcome}>
      <Container className={styles.welcome__container}>
        <Grid container spacing={2} width='100%'>
          <Grid
            size={{ xs: 12, md: 7, lg: 6 }}
            display='flex'
            flexDirection='column'
            justifyContent='center'
            sx={{
              alignItems: {
                xs: 'center',
                md: 'flex-start',
              },
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: '1.25rem',
                  sm: '1.5rem',
                  md: '2rem',
                  lg: '3rem',
                },
                fontWeight: 700,
              }}
            >
              {getWelcomeString(user, name, t('welcome'))}
            </Typography>

            <ListLinks isUser={!!user} />
          </Grid>
          <Grid
            size={{ xs: 12, md: 5, lg: 6 }}
            sx={{
              display: 'flex',
              justifyContent: {
                xs: 'center',
                md: 'flex-end',
              },
            }}
          >
            <Box
              component='img'
              sx={{
                width: '100%',
                height: 'auto',
                maxWidth: { xs: 427, sm: 498, md: 559 },
                maxHeight: { xs: 300, sm: 350, md: 400 },
              }}
              alt='Main page picture'
              src='/main.png'
            />
          </Grid>
        </Grid>
        <ErrorNotification error={fetchUserNameError} />
      </Container>
    </Box>
  );
};
