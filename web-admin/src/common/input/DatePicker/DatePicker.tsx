import classNames from 'classnames';
import { FieldValues, FormState, Path, UseFormRegister } from 'react-hook-form';

import styles from './DatePicker.module.css';

export interface Props<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  formState: FormState<T>;
  required?: boolean;
  max?: number;
  min?: number;
  className?: string;
  disableChangeStyles?: boolean;
}

export function DatePicker<T extends FieldValues>({
  label,
  name,
  register,
  formState,
  required,
  max,
  min,
  className,
  disableChangeStyles,
}: Props<T>) {
  const isTouched = !!formState.touchedFields[name];
  const hasChanges = !disableChangeStyles && isTouched;

  return (
    <label
      className={classNames(styles.wrapper, className, {
        [styles.touched]: isTouched,
        [styles.changes]: hasChanges,
      })}
    >
      <input
        className={styles.input}
        type="datetime-local"
        {...register(name, { required, max, min })}
      />

      <span className={styles.label}>{label}</span>
    </label>
  );
}
