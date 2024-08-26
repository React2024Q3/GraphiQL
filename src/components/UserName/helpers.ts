import { User } from 'firebase/auth';

export const getWelcomeString = (
  user: User | null | undefined,
  name: string,
  previousRoute: string
): string => {
  if (user && name) {
    return `Welcome${previousRoute === 'sign-in' ? ' Back' : ''}, ${name}!`;
  }
  return `Welcome!`;
};
