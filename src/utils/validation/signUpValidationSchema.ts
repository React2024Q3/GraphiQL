import * as yup from 'yup';
import { confirmPasswordSchema, emailSchema, nameSchema, passwordSchema } from './helpers';

export const singUpValidationSchema = yup.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
});
