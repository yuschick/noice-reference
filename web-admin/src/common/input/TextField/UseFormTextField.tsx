import {
  FieldValues,
  Path,
  UseFormRegister,
  FormState,
  ValidationRule,
} from 'react-hook-form';

import { BaseTextField, BaseTextFieldProps } from './BaseTextField';

export interface Props<T extends FieldValues>
  extends Omit<BaseTextFieldProps, 'isDirty' | 'hasChanges'> {
  name: Path<T>;
  register: UseFormRegister<T>;
  formState: FormState<T>;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  pattern?: ValidationRule<RegExp>;
  disableChangeStyles?: boolean;
}

export function UseFormTextField<T extends FieldValues>({
  label,
  name,
  type,
  size,
  register,
  formState,
  required,
  maxLength,
  minLength,
  min,
  max,
  placeholder,
  pattern,
  className,
  disableChangeStyles,
}: Props<T>) {
  const isDirty = !!formState.dirtyFields[name];
  const hasChanges = !disableChangeStyles && isDirty;

  return (
    <BaseTextField
      className={className}
      hasChanges={hasChanges}
      isDirty={isDirty}
      label={label}
      placeholder={placeholder}
      size={size}
      type={type}
      {...register(name, {
        required,
        maxLength,
        minLength,
        min,
        max,
        pattern,
      })}
    />
  );
}
