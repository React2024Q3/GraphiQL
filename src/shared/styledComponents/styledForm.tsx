import { Box, Button, styled, TextField, Typography } from '@mui/material';

const StyledBox = styled(Box)({
  marginTop: '4rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const StyledForm = styled(Box)({
  width: '100%',
  maxWidth: '600px',
  marginTop: '0.5rem',
});

const StyledMessageBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '2rem',
});

const StyledButton = styled(Button)({
  marginTop: '1rem',
  padding: '0.7rem 3rem',
  alignSelf: 'center',
});

const StyledTextField = styled(TextField)({
  marginTop: '0.625rem',
  marginBottom: '0.25rem',
});

const StyledHeader = styled(Typography)({
  marginBottom: '2rem',
});

export { StyledBox, StyledForm, StyledMessageBox, StyledButton, StyledTextField, StyledHeader };
