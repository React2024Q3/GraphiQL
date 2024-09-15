'use client';

import { ReactNode, createContext, useContext } from 'react';

import { auth } from '@/firebase/config';
import { useTranslations } from 'next-intl';
import { useAuthState } from 'react-firebase-hooks/auth';

import { AuthContextType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, loading, error] = useAuthState(auth);

  return <AuthContext.Provider value={{ user, loading, error }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  const t = useTranslations();

  if (context === undefined) {
    throw new Error(t('errors.use-auth-error'));
  }

  return context;
};
