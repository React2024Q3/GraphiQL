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
        message: 'This email is already in use.',
      });
    } else if (error.message.includes('auth/invalid-credential')) {
      setFirebaseError('Invalid credentials. Please check your email and password.');
    } else {
      setFirebaseError('An error occurred. Please try again.');
    }
  }
};
