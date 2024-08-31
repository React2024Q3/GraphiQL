import { User } from 'firebase/auth';

export type AuthContextType = {
  user: User | null | undefined;
  loading: boolean;
  error: Error | undefined;
};
