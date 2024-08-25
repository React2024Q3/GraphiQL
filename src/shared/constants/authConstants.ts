import { SignUpFormData } from '@/types&interfaces/types';

export const SIGN_UP_FORM_FIELDS: (keyof SignUpFormData)[] = [
  'name',
  'email',
  'password',
  'confirmPassword',
];
