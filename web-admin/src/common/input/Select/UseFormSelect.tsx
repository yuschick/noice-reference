import { FieldValues, FormState, Path, UseFormRegister } from 'react-hook-form';

import { BaseSelect, BaseSelectProps } from './BaseSelect';

interface Props<T extends FieldValues>
  extends Omit<BaseSelectProps, 'hasChanges' | 'isDirty'> {
  name: Path<T>;
  register: UseFormRegister<T>;
  formState: FormState<T>;
  required?: boolean;
  disableChangeStyles?: boolean;
}

export function UseFormSelect<T extends FieldValues>({
  label,
  options,
  name,
  register,
  formState,
  required,
  className,
  size,
  disableChangeStyles,
}: Props<T>) {
  const isDirty = !!formState.dirtyFields[name];
  const hasChanges = !disableChangeStyles && isDirty;

  return (
    <BaseSelect
      className={className}
      hasChanges={hasChanges}
      isDirty={isDirty}
      label={label}
      options={options}
      size={size}
      {...register(name, { required })}
    />
  );
}
