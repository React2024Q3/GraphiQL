import { Dispatch, SetStateAction } from 'react';
import { UseFormSetError } from 'react-hook-form';

export const getHelperText = (error: string | undefined) => {
  return error ? error : ' ';
};

export const handleAuthError = (
  error: unknown,
  setFirebaseError: Dispatch<SetStateAction<string>>,
  setError?: UseFormSetError<{ email: string }>
) => {
  if (error instanceof Error) {
    if (setError && error.message.includes('auth/email-already-in-use')) {
      setError('email', {
        type: 'manual',
        message: 'errors.email-in-use',
      });
    } else if (error.message.includes('auth/invalid-credential')) {
      setFirebaseError('errors.invalid-credentials');
    } else {
      setFirebaseError('errors.error-occurred');
    }
  } else {
    setFirebaseError(error as string);
  }
};
