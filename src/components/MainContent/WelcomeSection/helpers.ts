import { User } from 'firebase/auth';

export const getWelcomeString = (
  user: User | null | undefined,
  name: string,
  greetingPartWelcome: string
): string => {
  if (user && name) {
    return `${greetingPartWelcome}, ${name}!`;
  }
  return `${greetingPartWelcome}!`;
};
