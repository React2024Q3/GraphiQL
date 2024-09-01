'use client';

import { useEffect, useState } from 'react';

import { RequestType } from '@/app/[locale]/history/types';
import { ErrorNotification } from '@/components/ErrorNotification';
import { CommonLinks } from '@/components/ListLinks/CommonLinks';
import linksStyles from '@/components/ListLinks/ListLinks.module.css';
import { Loader } from '@/components/Loader';
import { useAuthRedirect } from '@/shared/hooks/useAuthRedirect';
import { getLinkFromRequest } from '@/utils/historyHelpers';
import { Container, Typography } from '@mui/material';
import Link from 'next/link';

import styles from './history.module.css';

export default function History() {
  const { loading, error } = useAuthRedirect();
  const [history, setHistory] = useState<RequestType[]>([]);
  history.sort((a, b) => b.timestamp - a.timestamp);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('request_history') || '[]');
    setHistory(storedHistory);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className={styles.history__container}>
      <Typography className={styles.history__title} variant='h4' component='h4'>
        History Requests
      </Typography>
      {!history.length ? (
        <>
          <Typography variant='subtitle1'>You haven't executed any requests</Typography>
          <Typography variant='subtitle1'>It's empty here. Try:</Typography>
          <ul className={linksStyles.list}>
            <CommonLinks />
          </ul>
        </>
      ) : (
        history.map((request) => (
          <Link href={getLinkFromRequest(request)} key={request.timestamp}>
            {`${request.method} ${request.endpointUrl}`}
          </Link>
        ))
      )}
      <ErrorNotification error={error} />
    </Container>
  );
}
