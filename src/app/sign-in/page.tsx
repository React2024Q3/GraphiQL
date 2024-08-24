'use client';

import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
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

function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading, error] = useAuthState(auth);

  if (user) {
    return router.push('/');
  }

  if (loading) {
    return <Loader />;
  }

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password);
    router.push('/restful');
  };

  return (
    <StyledContainer>
      <StyledBox>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        {error && <Alert severity="error">{error.message}</Alert>}
        <StyledForm component="form">
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <StyledButton type="button" fullWidth variant="contained" onClick={handleSignIn}>
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
