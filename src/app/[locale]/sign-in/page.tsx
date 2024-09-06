'use client';

import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { ErrorNotification } from '@/components/ErrorNotification';
import { FormField } from '@/components/FormField';
import { Loader } from '@/components/Loader';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { logInWithEmailAndPassword } from '@/firebase/utils';
import { Link, useRouter } from '@/navigation';
import styles from '@/shared/styles/auth.module.css';
import { SignInFormData } from '@/types&interfaces/types';
import { handleAuthError } from '@/utils/authHelpers';
import { singInValidationSchema } from '@/utils/validation/signInValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Container, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

function SignIn() {
  const router = useRouter();
  const { user, loading, error } = useAuth();
  const [firebaseError, setFirebaseError] = useState('');
  const t = useTranslations();

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

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
    <Container className={styles.auth__container}>
      <Typography className={styles.auth__title} variant='h4'>
        {t('buttons.sign-in')}
      </Typography>
      <ErrorNotification error={error} />
      <form className={styles.auth__form} onSubmit={handleSubmit(onSubmit)}>
        <FormField<SignInFormData>
          name='email'
          control={control}
          label={t('auth.email')}
          type={'email'}
          errors={errors}
        />
        <FormField<SignInFormData>
          name='password'
          control={control}
          label={t('auth.password')}
          type={'password'}
          errors={errors}
        />
        <Typography color='error' variant='body2'>
          {firebaseError || '\u00A0'}
        </Typography>
        <Button
          color='primary'
          className={styles.auth__button}
          type='submit'
          fullWidth
          variant='contained'
          disabled={loading}
        >
          {t('buttons.sign-in')}
        </Button>
        <Box className={styles.auth__message}>
          {t('auth.message-1-sign-in')}&nbsp;<Link href='/sign-up'>{t('buttons.sign-up')}</Link>
          &nbsp;{t('auth.message-2')}
        </Box>
      </form>
    </Container>
  );
}

export default SignIn;
