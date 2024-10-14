import { FieldValues, FormState, Path, UseFormRegister } from 'react-hook-form';

import { BaseTextarea, BaseTextareaProps } from './BaseTextarea';

export interface Props<T extends FieldValues>
  extends Omit<BaseTextareaProps, 'isDirty' | 'hasChanges'> {
  name: Path<T>;
  register: UseFormRegister<T>;
  formState: FormState<T>;
  rows?: number;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  placeholder?: string;
  disableChangeStyles?: boolean;
}
export function UseFormTextarea<T extends FieldValues>({
  label,
  name,
  register,
  formState,
  rows,
  required,
  maxLength,
  minLength,
  placeholder,
  className,
  size,
  disableChangeStyles,
}: Props<T>) {
  const isDirty = !!formState.dirtyFields[name];
  const hasChanges = !disableChangeStyles && isDirty;

  return (
    <BaseTextarea
      className={className}
      hasChanges={hasChanges}
      isDirty={isDirty}
      label={label}
      placeholder={placeholder}
      rows={rows}
      size={size}
      {...register(name, { required, maxLength, minLength })}
    />
  );
}
