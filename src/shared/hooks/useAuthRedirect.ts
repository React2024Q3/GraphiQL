import { useEffect } from 'react';

import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useRouter } from 'next/navigation';

export const useAuthRedirect = () => {
  const router = useRouter();
  const { user, loading, error } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, router, loading]);

  return { loading, error };
};
