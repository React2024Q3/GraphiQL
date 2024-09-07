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
      <Typography variant='h3' component='span' fontWeight={700} color='primary.dark'>
        {condition ? `${name}!` : '\u00A0'}
      </Typography>
      {}
    </>
  );
};
