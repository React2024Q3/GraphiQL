import { Controller, FieldValues, Path } from 'react-hook-form';

import { StyledTextField } from '@/shared/styledComponents/styledForm';
import { getHelperText } from '@/utils/authHelpers';

import { FormFieldProps } from './types';

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  required = true,
  errors,
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name as Path<T>}
      control={control}
      render={({ field }) => (
        <StyledTextField
          {...field}
          label={label}
          type={type}
          variant='outlined'
          required={required}
          error={!!errors[name as keyof typeof errors]}
          helperText={getHelperText(errors[name as keyof typeof errors]?.message?.toString())}
          fullWidth
          margin='normal'
        />
      )}
    />
  );
}
