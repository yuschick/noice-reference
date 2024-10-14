import { VisuallyHidden } from '@noice-com/common-ui';
import classNames from 'classnames';
import { ComponentProps, forwardRef } from 'react';

import { InputOption } from '../types';

import styles from './BaseSelect.module.css';

export interface BaseSelectProps {
  /** Defaults to small */
  size?: 'small' | 'medium' | 'large';
  label: string;
  options: string[] | InputOption[];
  hasChanges?: boolean;
  isDirty?: boolean;
  className?: string;
  hideLabel?: boolean;
  preventNoValueOption?: boolean;
}

interface Props extends BaseSelectProps, Omit<ComponentProps<'select'>, 'ref' | 'size'> {}

export const BaseSelect = forwardRef<HTMLSelectElement, Props>(
  (
    {
      label,
      options,
      hasChanges,
      isDirty,
      className,
      size,
      hideLabel,
      preventNoValueOption,
      ...props
    },
    ref,
  ) => {
    const optionsWithValues = options.map<InputOption>((option) => {
      if (typeof option === 'string') {
        return {
          value: option,
          label: option,
        };
      }

      return option;
    });

    return (
      <label
        className={classNames(styles.wrapper, className, styles[size || 'small'], {
          [styles.touched]: isDirty,
          [styles.changes]: hasChanges,
        })}
      >
        <select
          className={styles.select}
          ref={ref}
          {...props}
        >
          {!preventNoValueOption && (
            <option value="">-- Please choose an option --</option>
          )}

          {optionsWithValues.map(({ value, label }) => (
            <option
              key={value}
              value={value}
            >
              {label}
            </option>
          ))}
        </select>

        {hideLabel ? (
          <VisuallyHidden>{label}</VisuallyHidden>
        ) : (
          <span className={styles.label}>{label}</span>
        )}
      </label>
    );
  },
);
