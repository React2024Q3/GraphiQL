import { Box, Button, Container, styled } from '@mui/material';

const StyledContainer = styled(Container)({
  maxWidth: 'sm',
});

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

export { StyledContainer, StyledBox, StyledForm, StyledMessageBox, StyledButton };
