'use client';

import { FC } from 'react';

import { useError } from '@/contexts/ErrorContext/ErrorContext';
import { Alert, Snackbar } from '@mui/material';

export const Toaster: FC = () => {
  const { error, open, hideError } = useError();

  if (!error) return null;
  const message = typeof error === 'string' ? error : error.message;

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={hideError}>
      <Alert onClose={hideError} severity={'error'} variant='filled' sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
