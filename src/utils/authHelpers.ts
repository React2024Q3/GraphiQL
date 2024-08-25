// import { SignUpFormData } from '@/types&interfaces/types';
// import { UseFormGetValues } from 'react-hook-form';

import { Dispatch, SetStateAction } from 'react';
import { UseFormSetError } from 'react-hook-form';

// const isFieldEmpty: (
//   field: keyof SignUpFormData,
//   getValues: UseFormGetValues<SignUpFormData>
// ) => boolean = (field, getValues) => {
//   return !getValues(field);
// };

// export const areAllFieldsFilledIn: (
//   fieldNames: (keyof SignUpFormData)[],
//   getValues: UseFormGetValues<SignUpFormData>
// ) => boolean = (fieldNames, getValues) => {
//   return fieldNames.every((field) => !isFieldEmpty(field, getValues));
// };

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
