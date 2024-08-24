'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import { registerWithEmailAndPassword } from '@/firebase/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader } from '@/components/Loader';
import {
  StyledBox,
  StyledButton,
  StyledContainer,
  StyledForm,
  StyledMessageBox,
} from '@/shared/styledComponents/styledForm';
import { Alert, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { singUpValidationSchema } from '@/shared/validation/signUpValidationSchema';
import { SignUpFormData } from '@/types&interfaces/types';
// import { areAllFieldsFilledIn } from '@/shared/utils/formHelpers';
// import { SIGN_UP_FORM_FIELDS } from '@/shared/constants/formConstants';

function SignUp() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  console.log('user', user);

  // const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    // getValues,
    // watch,
  } = useForm<SignUpFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(singUpValidationSchema),
    // mode: 'onChange',
  });

  // const watchedFields = watch(SIGN_UP_FORM_FIELDS);

  const isButtonDisabled = loading; /* || Object.keys(errors).length > 0 */

  // useEffect(() => {
  //   console.log('errors', Object.keys(errors));
  //   console.log('isButtonDisabled', isButtonDisabled);
  //   setIsButtonDisabled(
  //     loading ||
  //       /* !areAllFieldsFilledIn(SIGN_UP_FORM_FIELDS, getValues) || */
  //       Object.keys(errors).length > 0
  //   );
  // }, [errors, loading, isButtonDisabled /* , getValues, watchedFields */]);

  const onSubmit: SubmitHandler<SignUpFormData> = async ({ name, email, password }) => {
    try {
      await registerWithEmailAndPassword(name, email, password);
      if (auth.currentUser) {
        return router.push('/restful');
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('auth/email-already-in-use')) {
        setError('email', {
          type: 'manual',
          message: 'This email is already in use.',
        });
      } else {
        console.error('Sign-up error:', error);
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
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        {error && <Alert severity="error">{error.message}</Alert>}
        <StyledForm component="form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                variant="outlined"
                required
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
                margin="normal"
              />
            )}
          />
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
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Confirm Password"
                type="password"
                variant="outlined"
                required
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                fullWidth
                margin="normal"
              />
            )}
          />
          <StyledButton type="submit" fullWidth variant="contained" disabled={isButtonDisabled}>
            Sign Up
          </StyledButton>
          <StyledMessageBox>
            Already have an account?&nbsp;<Link href="/sign-in">Sign in</Link>
            &nbsp;now.
          </StyledMessageBox>
        </StyledForm>
      </StyledBox>
    </StyledContainer>
  );
}

export default SignUp;
