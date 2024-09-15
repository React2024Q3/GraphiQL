'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

import { AppError, ErrorContextType } from './types';

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<AppError>(null);

  const showError = (error: AppError) => {
    setError(error);
    setOpen(true);
  };

  const hideError = () => {
    setOpen(false);
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ showError, hideError, error, open }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
