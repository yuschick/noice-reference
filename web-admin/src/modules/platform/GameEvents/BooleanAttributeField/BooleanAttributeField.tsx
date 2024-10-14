import { GameEventAttribute } from '../types';

import styles from './BooleanAttributeField.module.css';

import { TextField, Select } from '@common/input';

interface Props {
  attribute: GameEventAttribute;
  onChange(value: Record<string, boolean>): void;
}

export function BooleanAttributeField({ attribute, onChange }: Props) {
  const onValueChange = (value: string) => {
    if (!value) {
      return;
    }

    onChange({ [attribute.key]: value === 'True' });
  };

  return (
    <div className={styles.wrapper}>
      <TextField
        defaultValue={attribute.key}
        label="Key"
        readOnly
      />

      <Select
        label="Value"
        options={['True', 'False']}
        onChange={onValueChange}
      />
    </div>
  );
}
