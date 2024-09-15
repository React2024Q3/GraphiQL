import { Typography } from '@mui/material';
import { User } from 'firebase/auth';

export const getWelcomeString = (
  user: User | null | undefined,
  name: string,
  greetingPartWelcome: string
): JSX.Element => {
  const condition = user && name;
  return (
    <>
      {greetingPartWelcome}
      {!condition ? `!` : ', '}
      <Typography
        component='span'
        color='primary.dark'
        sx={{
          fontSize: {
            xs: '1.25rem',
            sm: '1.5rem',
            md: '2rem',
            lg: '3rem',
          },
          fontWeight: 700,
        }}
      >
        {condition ? `${name}!` : '\u00A0'}
      </Typography>
      {}
    </>
  );
};
