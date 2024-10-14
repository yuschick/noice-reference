import { CoreAssets } from '@noice-com/assets-core';
import { Icon, LoadingSpinner } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Option } from '../types';

import styles from './SelectableList.module.css';

interface Props<T extends string, K extends Option<T>> {
  label: string;
  selected?: T;
  loading?: boolean;
  disabled?: boolean;
  options?: K[];
  onSelect: (option: K) => void;
}

export function SelectableList<T extends string, K extends Option<T> = Option<T>>({
  loading,
  label,
  options,
  onSelect,
  selected,
  disabled,
}: Props<T, K>) {
  const id = useRef(`selectable-list${uuidv4()}`);

  return (
    <div>
      <span
        className={styles.label}
        id={id.current}
      >
        {label}
      </span>

      {loading ? (
        <div className={styles.loadingWrapper}>
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <ul
          aria-labelledby={id.current}
          className={styles.list}
        >
          {options?.map((option) => (
            <li key={option.value}>
              <button
                className={classNames(styles.option, {
                  [styles.selected]: selected === option.value,
                })}
                disabled={disabled}
                type="button"
                onClick={() => onSelect(option)}
              >
                <Icon
                  className={styles.icon}
                  icon={CoreAssets.Icons.CheckStudio}
                />

                <span className={styles.gameName}>{option.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
