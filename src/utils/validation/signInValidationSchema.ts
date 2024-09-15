import * as yup from 'yup';

import { emailSchema, passwordSchema } from './helpers';

export const singInValidationSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
});
