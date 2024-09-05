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
      {!condition ? `!` : ','}
      <br />
      <Typography variant='h4' component='span' fontWeight={700} color='secondary.dark'>
        {condition ? `${name}!` : '\u00A0'}
      </Typography>
      {}
    </>
  );
};
