import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useCallback } from 'react';

import styles from './RadioInput.module.css';

export interface Props {
  name: string;
  value: string;
  checked?: boolean;
  label: string;
  onChange(inputValue: string): void;
}

export function RadioInput({ name, checked, value, label, onChange }: Props) {
  const onCheckedChange = useCallback(() => {
    onChange(value);
  }, [onChange, value]);

  return (
    <label className={styles.container}>
      <input
        checked={checked}
        className={styles.input}
        name={name}
        type="radio"
        value={value}
        onChange={onCheckedChange}
      />
      <span className={styles.label}>{label}</span>
      <div className={classNames(styles.checkmarkWrapper)}>
        <Icon
          className={styles.checkmark}
          icon={CoreAssets.Icons.Check}
        />
      </div>
    </label>
  );
}
