import { useState } from 'react';

import { GameEventAttribute } from '../types';

import styles from './StringAttributeField.module.css';

import { TextField, Select } from '@common/input';

interface Props {
  attribute: GameEventAttribute;
  onChange(value: Record<string, string>): void;
}

export function StringAttributeField({ attribute, onChange }: Props) {
  const [value, setValue] = useState('');

  const onValueChange = (value: string) => {
    setValue(value);
    onChange({ [attribute.key]: value });
  };

  return (
    <div className={styles.wrapper}>
      <TextField
        defaultValue={attribute.key}
        label="Key"
        readOnly
      />

      {attribute.value?.options ? (
        <Select
          label="Value"
          options={attribute.value.options}
          onChange={onValueChange}
        />
      ) : (
        <TextField
          defaultValue={value}
          label="Value"
          onChange={onValueChange}
        />
      )}
    </div>
  );
}
