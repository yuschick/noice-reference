import { FormEvent, useRef } from 'react';

import styles from './AddTimeConditionForm.module.css';

import { Button } from '@common/button';

interface Props {
  excludeOptions?: string[];
  onSubmit(value: string): void;
  onReset(): void;
}

export function AddTimeConditionForm({ onSubmit: onSubmitProp, onReset }: Props) {
  const datePickerRef = useRef<HTMLInputElement>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!datePickerRef.current) {
      return;
    }
    const time = new Date(datePickerRef.current.value);
    onSubmitProp(time.toISOString());
  };

  return (
    <form
      className={styles.form}
      onReset={onReset}
      onSubmit={onSubmit}
    >
      <label>
        <input
          className={styles.input}
          ref={datePickerRef}
          type="datetime-local"
        />

        <span className={styles.label}>Time</span>
      </label>
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
