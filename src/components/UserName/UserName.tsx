'use client';

import { FC, useEffect, useState } from 'react';

import { Loader } from '@/components/Loader';
import { Notification } from '@/components/Notification';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { fetchUserName } from '@/firebase/utils';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import ListLinks from '../ListLinks';
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

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <h2>
        {getWelcomeString(
          user,
          name,
          previousRoute,
          t('GreetingPartWelcome'),
          t('GreetingPartBack')
        )}
      </h2>
      <ListLinks isUser={!!user} />
      {error && <Notification isOpen={!!error} message={error.message} severity='error' />}
      {fetchUserNameError && (
        <Notification
          isOpen={!!fetchUserNameError}
          message={fetchUserNameError.message}
          severity='error'
        />
      )}
    </>
  );
};
