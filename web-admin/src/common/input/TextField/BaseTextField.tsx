import { VisuallyHidden } from '@noice-com/common-ui';
import classNames from 'classnames';
import { ComponentProps, forwardRef } from 'react';

import styles from './BaseTextField.module.css';

export interface BaseTextFieldProps {
  /** Defaults to small */
  size?: 'small' | 'medium' | 'large';
  /** Defaults to text */
  type?: 'text' | 'url' | 'number' | 'email' | 'time';
  label: string;
  hasChanges?: boolean;
  isDirty?: boolean;
  className?: string;
  hideLabel?: boolean;
}

interface Props
  extends BaseTextFieldProps,
    Omit<ComponentProps<'input'>, 'ref' | 'type' | 'size'> {}

export const BaseTextField = forwardRef<HTMLInputElement, Props>(
  ({ type, label, hasChanges, isDirty, className, size, hideLabel, ...props }, ref) => {
    return (
      <label
        className={classNames(styles.wrapper, styles[size || 'small'], className, {
          [styles.changes]: hasChanges,
          [styles.touched]: isDirty,
        })}
      >
        <input
          className={styles.input}
          ref={ref}
          type={type || 'text'}
          {...props}
        />

        {hideLabel ? (
          <VisuallyHidden>{label}</VisuallyHidden>
        ) : (
          <span className={styles.label}>{label}</span>
        )}
      </label>
    );
  },
);
