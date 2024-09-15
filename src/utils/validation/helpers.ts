import * as yup from 'yup';

const transformEmptyString = (value: string) => (value === '' ? undefined : value);

const nameSchema = yup
  .string()
  .transform(transformEmptyString)
  .required('errors.name-required')
  .matches(/^\p{Lu}.*$/u, 'errors.name-uppercase-letter');

const emailSchema = yup.string().required('errors.email-required').email('errors.email-invalid');

const passwordSchema = yup
  .string()
  .transform(transformEmptyString)
  .required('errors.password-required')
  .min(8, 'errors.password-length')
  .matches(/^(?=.*\p{N})(?=.*\p{L})(?=.*[@$!%*?&]).*$/u, 'errors.password-strength');

const confirmPasswordSchema = yup
  .string()
  .transform(transformEmptyString)
  .required('errors.confirm-password-required')
  .oneOf([yup.ref('password')], 'errors.password-match');

const urlRe =
  /^((ftp|http|https):\/\/)?([a-zA-Z0-9_-]+\.)+[a-zA-Z]+(\/[a-zA-Z0-9_-]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/gm;

const urlSchema = yup.string().matches(urlRe, 'urlNotValid');

export { nameSchema, emailSchema, passwordSchema, confirmPasswordSchema, urlSchema };
