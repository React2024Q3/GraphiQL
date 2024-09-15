'use client';

import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { ErrorNotification } from '@/components/ErrorNotification';
import { FormField } from '@/components/FormField';
import { Loader } from '@/components/Loader';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { registerWithEmailAndPassword } from '@/firebase/utils';
import { Link, useRouter } from '@/navigation';
import styles from '@/shared/styles/auth.module.css';
import { SignUpFormData } from '@/types&interfaces/types';
import { handleAuthError } from '@/utils/authHelpers';
import { singUpValidationSchema } from '@/utils/validation/signUpValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Container, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

function SignUp() {
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
      handleAuthError(error, setFirebaseError, setError);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className={styles.auth__container}>
      <Typography className={styles.auth__title} variant='h4'>
        {t('buttons.sign-up')}
      </Typography>
      <ErrorNotification error={error} />
      <form className={styles.auth__form} onSubmit={handleSubmit(onSubmit)}>
        <FormField<SignUpFormData>
          name='name'
          control={control}
          label={t('auth.name')}
          errors={errors}
        />
        <FormField<SignUpFormData>
          name='email'
          control={control}
          label={t('auth.email')}
          type={'email'}
          errors={errors}
        />
        <FormField<SignUpFormData>
          name='password'
          control={control}
          label={t('auth.password')}
          type={'password'}
          errors={errors}
        />
        <FormField<SignUpFormData>
          name='confirmPassword'
          control={control}
          label={t('auth.confirm-password')}
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
          {t('buttons.sign-up')}
        </Button>
        <Box className={styles.auth__message}>
          {t('auth.message-1-sign-up')}&nbsp;<Link href='/sign-in'>{t('buttons.sign-in')}</Link>
          &nbsp;{t('auth.message-2')}
        </Box>
      </form>
    </Container>
  );
}

export default SignUp;
