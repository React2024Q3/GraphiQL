'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/config';
import { Loader } from '@/components/Loader';
import { Alert, TextField, Typography } from '@mui/material';
import {
  StyledBox,
  StyledButton,
  StyledContainer,
  StyledForm,
  StyledMessageBox,
} from '../../shared/styledComponents/styledForm';
import Link from 'next/link';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { SignInFormData } from '@/types&interfaces/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { singInValidationSchema } from '@/shared/validation/signInValidationSchema';
import { logInWithEmailAndPassword } from '@/firebase/utils';

function SignIn() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
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
        router.push('/restful');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
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
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        {error && <Alert severity="error">{error.message}</Alert>}
        <StyledForm component="form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="E-mail"
                variant="outlined"
                required
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                margin="normal"
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                variant="outlined"
                required
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
                margin="normal"
              />
            )}
          />
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
