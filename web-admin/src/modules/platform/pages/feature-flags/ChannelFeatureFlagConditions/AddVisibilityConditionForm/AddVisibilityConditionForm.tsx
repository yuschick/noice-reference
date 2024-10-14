import { FormEvent, useRef } from 'react';

import styles from './AddVisibilityConditionForm.module.css';

import { Button } from '@common/button';
import { Select } from '@common/input';

interface Props {
  excludeOptions?: string[];
  onSubmit(value: string): void;
  onReset(): void;
}

export function AddVisibilityConditionForm({
  onSubmit: onSubmitProp,
  onReset,
  excludeOptions,
}: Props) {
  const selectRef = useRef<HTMLSelectElement>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectRef.current) {
      return;
    }

    onSubmitProp(selectRef.current.value);
  };

  return (
    <form
      className={styles.form}
      onReset={onReset}
      onSubmit={onSubmit}
    >
      <Select
        className={styles.select}
        label="Visibility"
        options={['private', 'public'].filter(
          (value) => !excludeOptions?.includes(value),
        )}
        ref={selectRef}
        preventNoValueOption
        required
      />

      <Button
        text="Add"
        type="submit"
      />

      <Button
        buttonType="ghost"
        text="Cancel"
        type="reset"
      />
    </form>
  );
}
