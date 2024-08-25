import * as yup from 'yup';

const transformEmptyString = (value: string) => (value === '' ? undefined : value);

const nameSchema = yup
  .string()
  .transform(transformEmptyString)
  .required('Name is required')
  .matches(/^\p{Lu}.*$/u, 'Name must start with an uppercase letter');

const emailSchema = yup.string().required('Email is required').email('Invalid email');

const passwordSchema = yup
  .string()
  .transform(transformEmptyString)
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters long')
  .matches(
    /^(?=.*\p{N})(?=.*\p{L})(?=.*[@$!%*?&]).*$/u,
    'Password must contain at least one letter, one digit, one special character'
  );

const confirmPasswordSchema = yup
  .string()
  .transform(transformEmptyString)
  .required('Confirm password is required')
  .oneOf([yup.ref('password')], 'Passwords must match');

export { nameSchema, emailSchema, passwordSchema, confirmPasswordSchema };
