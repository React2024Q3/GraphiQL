import { User } from 'firebase/auth';

export const getWelcomeString = (
  user: User | null | undefined,
  name: string,
  previousRoute: string,
  greetingPartWelcome: string,
  greetingPartBack: string
): string => {
  if (user && name) {
    return `${greetingPartWelcome}${previousRoute === 'sign-in' ? ` ${greetingPartBack}` : ''}, ${name}!`;
  }
  return greetingPartWelcome;
};
