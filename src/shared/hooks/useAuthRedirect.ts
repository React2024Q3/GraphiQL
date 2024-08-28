import { useEffect } from 'react';

import { auth } from '@/firebase/config';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';

export const useAuthRedirect = () => {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, router, loading]);

  return { loading, error };
};
