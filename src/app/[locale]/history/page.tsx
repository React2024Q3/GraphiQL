'use client';

import { useEffect, useState } from 'react';

import { RequestType } from '@/app/[locale]/history/types';
import { Loader } from '@/components/Loader';
import { Notification } from '@/components/Notification';
import { auth } from '@/firebase/config';
import { getLinkFromRequest } from '@/utils/historyHelpers';
import { Container, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function History() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [history, setHistory] = useState<RequestType[]>([]);
  // const history: RequestType[] = JSON.parse(localStorage.getItem('request_history') || '[]');
  history.sort((a, b) => b.timestamp - a.timestamp);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('request_history') || '[]');
    setHistory(storedHistory);
  }, []);

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [router, user]);

  if (loading) {
    return <Loader />;
  }

  if (!history.length) {
    return <p>You haven't executed any requests yet.</p>;
  }

  return (
    <Container>
      <Typography variant='h4' component='h4'>
        History Requests
      </Typography>
      {history.map((request) => (
        <Link href={getLinkFromRequest(request)} key={request.timestamp}>
          {`${request.method} ${request.url}`}
        </Link>
      ))}
      {error && <Notification isOpen={!!error} message={error.message} severity='error' />}
    </Container>
  );
}
