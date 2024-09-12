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

// matches:
// vercel.com
// www.vercel.com
// uptime-monitor-fe.vercel.app
// https://uptime-monitor-fe.vercel.app/
const urlRe =
  /^((ftp|http|https):\/\/)?([a-zA-Z0-9_-]+\.)+[a-zA-Z]+(\/[a-zA-Z0-9_-]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/gm;

const urlSchema = yup.string().matches(urlRe, 'URL is not valid');

export { nameSchema, emailSchema, passwordSchema, confirmPasswordSchema, urlSchema };
