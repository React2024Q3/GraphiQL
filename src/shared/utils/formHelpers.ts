import { SignUpFormData } from '@/types&interfaces/types';
import { UseFormGetValues } from 'react-hook-form';

export function areAllFieldsFilledIn(
  fieldNames: (keyof SignUpFormData)[],
  getValues: UseFormGetValues<SignUpFormData>
): boolean {
  return fieldNames.every((field) => !isFieldEmpty(field, getValues));
}

function isFieldEmpty(
  field: keyof SignUpFormData,
  getValues: UseFormGetValues<SignUpFormData>
): boolean {
  return !getValues(field);
}
