import { useEffect } from 'react';

import { auth } from '@/firebase/config';
import { logout } from '@/firebase/utils';
import { onIdTokenChanged } from 'firebase/auth';
import { useRouter } from 'next/router';

const useHandleExpiredToken = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        console.log('Token expired or user signed out');
        logout();
        router.replace('/');
      } else {
        try {
          await user.getIdToken(true);
        } catch (error) {
          console.error('Error refreshing token:', error);
          logout();
          router.replace('/');
        }
      }
    });

    return () => unsubscribe();
  }, [router]);
};

export default useHandleExpiredToken;
