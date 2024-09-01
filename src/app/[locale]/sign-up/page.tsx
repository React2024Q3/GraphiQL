'use client';

import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { FormField } from '@/components/FormField';
import { Loader } from '@/components/Loader';
import { Notification } from '@/components/Notification';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { registerWithEmailAndPassword } from '@/firebase/utils';
import { Link, useRouter } from '@/navigation';
import styles from '@/shared/styles/auth.module.css';
import { SignUpFormData } from '@/types&interfaces/types';
import { handleAuthError } from '@/utils/authHelpers';
import { singUpValidationSchema } from '@/utils/validation/signUpValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Container, Typography } from '@mui/material';

function SignUp() {
  const router = useRouter();
  const { user, loading, error } = useAuth();
  const [firebaseError, setFirebaseError] = useState('');

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(singUpValidationSchema),
  });

  const onSubmit: SubmitHandler<SignUpFormData> = async ({ name, email, password }) => {
    try {
      await registerWithEmailAndPassword(name, email, password);
    } catch (error) {
      console.log(error);
      handleAuthError(error, setFirebaseError, setError);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className={styles.auth__container}>
      <Typography className={styles.auth__title} variant='h4'>
        Sign Up
      </Typography>
      {error && <Notification isOpen={!!error} message={error.message} severity='error' />}
      <form className={styles.auth__form} onSubmit={handleSubmit(onSubmit)}>
        <FormField<SignUpFormData> name='name' control={control} label='Name' errors={errors} />
        <FormField<SignUpFormData>
          name='email'
          control={control}
          label='E-mail'
          type={'email'}
          errors={errors}
        />
        <FormField<SignUpFormData>
          name='password'
          control={control}
          label='Password'
          type={'password'}
          errors={errors}
        />
        <FormField<SignUpFormData>
          name='confirmPassword'
          control={control}
          label='Confirm Password'
          type={'password'}
          errors={errors}
        />
        <Typography color='error' variant='body2'>
          {firebaseError || '\u00A0'}
        </Typography>
        <Button
          className={styles.auth__button}
          type='submit'
          fullWidth
          variant='contained'
          disabled={loading}
        >
          Sign Up
        </Button>
        <Box className={styles.auth__message}>
          Already have an account?&nbsp;<Link href='/sign-in'>Sign in</Link>
          &nbsp;now.
        </Box>
      </form>
    </Container>
  );
}

export default SignUp;
