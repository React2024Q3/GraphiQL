'use client';

import { useEffect } from 'react';

import { useError } from '@/contexts/ErrorContext/ErrorContext';
import { AppError } from '@/contexts/ErrorContext/types';

export const useHandleError = (error: AppError) => {
  const { showError } = useError();

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);
};
