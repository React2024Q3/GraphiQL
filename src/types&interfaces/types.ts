import { Methods } from './enums';

export type SignInFormData = {
  email: string;
  password: string;
};

export type SignUpFormData = SignInFormData & {
  name: string;
  confirmPassword: string;
};

export type KeyValuePair = {
  key: string;
  value: string;
  editable: boolean;
};

export type KeyValuePairVar = Omit<KeyValuePair, 'editable'>;

export type MethodType = Methods.GET | Methods.DELETE | Methods.POST | Methods.PUT | Methods.PATCH;
