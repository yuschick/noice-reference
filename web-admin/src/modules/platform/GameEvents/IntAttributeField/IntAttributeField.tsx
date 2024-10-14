import { useState } from 'react';

import { GameEventAttribute } from '../types';

import styles from './IntAttributeField.module.css';

import { TextField } from '@common/input';

interface Props {
  attribute: GameEventAttribute;
  onChange(value: Record<string, number>): void;
}

export function IntAttributeField({ attribute, onChange }: Props) {
  const [value, setValue] = useState(0);

  const onValueChange = (stringValue: string) => {
    const value = parseInt(stringValue, 10);
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

      <TextField
        defaultValue={value}
        label="Value"
        type="number"
        onChange={onValueChange}
      />
    </div>
  );
}
