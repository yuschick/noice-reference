import { FormEvent, useRef } from 'react';

import styles from './AddPriorityConditionForm.module.css';

import { Button } from '@common/button';
import { Select } from '@common/input';
import { priorityOptions } from '@common/priority';

interface Props {
  excludeOptions?: string[];
  onSubmit(operator: string, priority: string): void;
  onReset(): void;
}

const comparisonOperators = [
  { value: 'eq', label: 'equal' },
  { value: 'gte', label: 'greater than or equal' },
  { value: 'lte', label: 'less than or equal' },
];

export function AddPriorityConditionForm({ onSubmit: onSubmitProp, onReset }: Props) {
  const operatorRef = useRef<HTMLSelectElement>(null);
  const priorityRef = useRef<HTMLSelectElement>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!operatorRef.current || !priorityRef.current) {
      return;
    }

    onSubmitProp(operatorRef.current.value, priorityRef.current.value);
  };

  return (
    <form
      className={styles.form}
      onReset={onReset}
      onSubmit={onSubmit}
    >
      <Select
        className={styles.select}
        label="Operator"
        options={comparisonOperators.map((option) => ({
          value: option.value.toString(),
          label: option.label,
        }))}
        ref={operatorRef}
        preventNoValueOption
        required
      />

      <Select
        className={styles.select}
        label="Priority"
        options={priorityOptions.map((option) => ({
          value: option.value.toString(),
          label: option.label,
        }))}
        ref={priorityRef}
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
