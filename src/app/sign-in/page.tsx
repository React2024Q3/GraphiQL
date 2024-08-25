'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/config';
import { Loader } from '@/components/Loader';
import { Container, Typography } from '@mui/material';
import {
  StyledBox,
  StyledButton,
  StyledForm,
  StyledHeader,
  StyledMessageBox,
} from '../../shared/styledComponents/styledForm';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SignInFormData } from '@/types&interfaces/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { singInValidationSchema } from '@/utils/validation/signInValidationSchema';
import { logInWithEmailAndPassword } from '@/firebase/utils';
import { useEffect, useState } from 'react';
import { Notification } from '@/components/Notification';
import { handleAuthError } from '@/utils/authHelpers';
import { FormField } from '@/components/FormField';

function SignIn() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [firebaseError, setFirebaseError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(singInValidationSchema),
  });

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const onSubmit: SubmitHandler<SignInFormData> = async ({ email, password }) => {
    try {
      await logInWithEmailAndPassword(email, password);
    } catch (error) {
      handleAuthError(error, setFirebaseError);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <StyledBox>
        <StyledHeader variant="h5">Sign In</StyledHeader>
        {error && <Notification isOpen={!!error} message={error.message} severity="error" />}
        <StyledForm component="form" onSubmit={handleSubmit(onSubmit)}>
          <FormField<SignInFormData>
            name="email"
            control={control}
            label="E-mail"
            type={'email'}
            errors={errors}
          />
          <FormField<SignInFormData>
            name="password"
            control={control}
            label="Password"
            type={'password'}
            errors={errors}
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
    </Container>
  );
}

export default SignIn;
