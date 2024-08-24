'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/config';
import { Loader } from '@/components/Loader';
import { Typography } from '@mui/material';
import {
  StyledBox,
  StyledButton,
  StyledContainer,
  StyledForm,
  StyledHeader,
  StyledMessageBox,
  StyledTextField,
} from '../../shared/styledComponents/styledForm';
import Link from 'next/link';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { SignInFormData } from '@/types&interfaces/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { singInValidationSchema } from '@/shared/validation/signInValidationSchema';
import { logInWithEmailAndPassword } from '@/firebase/utils';
import { useState } from 'react';
import { Notification } from '@/components/Notification';

function SignIn() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [firebaseError, setFirebaseError] = useState('');
  console.log('user', user);

  const {
    control,
    handleSubmit,
    formState: { errors },
    // getValues,
    // watch,
  } = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(singInValidationSchema),
    // mode: 'onChange',
  });

  const onSubmit: SubmitHandler<SignInFormData> = async ({ email, password }) => {
    console.log(email, password);
    try {
      await logInWithEmailAndPassword(email, password);
      if (auth.currentUser) {
        return router.push('/restful');
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('auth/invalid-credential')) {
        setFirebaseError('Invalid credentials. Please check your email and password.');
      } else {
        setFirebaseError('An error occurred. Please try again.');
      }
    }
  };

  if (user) {
    return router.push('/');
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <StyledContainer>
      <StyledBox>
        <StyledHeader variant="h5">Sign In</StyledHeader>
        {error && <Notification isOpen={!!error} message={error.message} severity="error" />}
        <StyledForm component="form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <>
                <StyledTextField
                  {...field}
                  label="E-mail"
                  variant="outlined"
                  required
                  error={!!errors.email}
                  helperText={errors.email?.message ? errors.email?.message : ' '}
                  fullWidth
                  margin="normal"
                />
              </>
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <>
                <StyledTextField
                  {...field}
                  label="Password"
                  type="password"
                  variant="outlined"
                  required
                  error={!!errors.password}
                  helperText={errors.password?.message ? errors.password?.message : ' '}
                  fullWidth
                  margin="normal"
                />
              </>
            )}
          />
          <Typography color="error" variant="body2">
            {firebaseError || '\u00A0'}
          </Typography>
          <StyledButton type="submit" fullWidth variant="contained" disabled={loading}>
            Sign In
          </StyledButton>
          <StyledMessageBox>
            Don't have an account?&nbsp;<Link href="/sign-up">Sign up</Link>
            &nbsp;now.
          </StyledMessageBox>
        </StyledForm>
      </StyledBox>
    </StyledContainer>
  );
}

export default SignIn;
