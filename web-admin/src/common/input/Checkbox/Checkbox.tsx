import { InputHTMLAttributes } from 'react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

import styles from './Checkbox.module.css';

export interface Props<T extends FieldValues>
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'className' | 'name' | 'style' | 'type'
  > {
  register: UseFormRegister<T>;
  label: string;
  name: Path<T>;
  required?: boolean;
}

export function Checkbox<T extends FieldValues>({
  label,
  name,
  register,
  required,
  ...htmlAttributes
}: Props<T>) {
  return (
    <label className={styles.wrapper}>
      <input
        {...htmlAttributes}
        className={styles.checkbox}
        type="checkbox"
        {...register(name, { required })}
      />

      <span className={styles.label}>{label}</span>
    </label>
  );
}
