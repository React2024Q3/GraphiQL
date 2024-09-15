import { Control, FieldErrors, FieldValues } from 'react-hook-form';

export type FormFieldProps<T extends FieldValues> = {
  name: keyof T;
  control: Control<T>;
  label: string;
  type?: string;
  required?: boolean;
  errors: FieldErrors<T>;
};
