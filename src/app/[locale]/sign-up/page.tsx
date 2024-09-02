'use client';

import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { FormField } from '@/components/FormField';
import { Loader } from '@/components/Loader';
import { Notification } from '@/components/Notification';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { registerWithEmailAndPassword } from '@/firebase/utils';
import { Link, useRouter } from '@/navigation';
import {
  StyledBox,
  StyledButton,
  StyledForm,
  StyledHeader,
  StyledMessageBox,
} from '@/shared/styledComponents/styledForm';
import { SignUpFormData } from '@/types&interfaces/types';
import { handleAuthError } from '@/utils/authHelpers';
import { singUpValidationSchema } from '@/utils/validation/signUpValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Container, Typography } from '@mui/material';

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
      registerWithEmailAndPassword(name, email, password);
    } catch (error) {
      handleAuthError(error, setFirebaseError, setError);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <StyledBox>
        <StyledHeader variant='h5'>Sign Up</StyledHeader>
        {error && <Notification isOpen={!!error} message={error.message} severity='error' />}
        <StyledForm component='form' onSubmit={handleSubmit(onSubmit)}>
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
          <StyledButton type='submit' fullWidth variant='contained' disabled={loading}>
            Sign Up
          </StyledButton>
          <StyledMessageBox>
            Already have an account?&nbsp;<Link href='/sign-in'>Sign in</Link>
            &nbsp;now.
          </StyledMessageBox>
        </StyledForm>
      </StyledBox>
    </Container>
  );
}

export default SignUp;
