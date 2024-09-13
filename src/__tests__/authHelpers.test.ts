import { UseFormSetError } from 'react-hook-form';

import { getHelperText, handleAuthError } from '@/utils/authHelpers';
import { describe, expect, it, vi } from 'vitest';

describe('getHelperText', () => {
  it('should return the error message if it is provided', () => {
    const error = 'Some error message';
    const result = getHelperText(error);
    expect(result).toBe('Some error message');
  });

  it('should return a single space if no error message is provided', () => {
    const error = undefined;
    const result = getHelperText(error);
    expect(result).toBe(' ');
  });
});

describe('handleAuthError', () => {
  const setFirebaseError = vi.fn();
  const setError = vi.fn() as unknown as UseFormSetError<{ email: string }>;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call setError with the correct parameters if email is already in use', () => {
    const error = new Error('auth/email-already-in-use');

    handleAuthError(error, setFirebaseError, setError);

    expect(setError).toHaveBeenCalledWith('email', {
      type: 'manual',
      message: 'errors.email-in-use',
    });
    expect(setFirebaseError).not.toHaveBeenCalled();
  });

  it('should call setFirebaseError with the correct message for invalid credentials', () => {
    const error = new Error('auth/invalid-credential');

    handleAuthError(error, setFirebaseError);

    expect(setFirebaseError).toHaveBeenCalledWith('errors.invalid-credentials');
    expect(setError).not.toHaveBeenCalled();
  });

  it('should call setFirebaseError with a general error message for other errors', () => {
    const error = new Error('some other error');

    handleAuthError(error, setFirebaseError);

    expect(setFirebaseError).toHaveBeenCalledWith('errors.error-occurred');
    expect(setError).not.toHaveBeenCalled();
  });

  it('should not call any function if error is not an instance of Error', () => {
    const error = 'not an error' as unknown;

    handleAuthError(error, setFirebaseError, setError);

    expect(setFirebaseError).toHaveBeenCalledWith(error);
    expect(setError).not.toHaveBeenCalled();
  });
});
