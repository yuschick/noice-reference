import classNames from 'classnames';
import { ComponentProps, forwardRef } from 'react';

import styles from './BaseTextarea.module.css';

export interface BaseTextareaProps {
  /** Defaults to small */
  size?: 'small' | 'medium' | 'large';
  label: string;
  hasChanges?: boolean;
  isDirty?: boolean;
  className?: string;
}

interface Props extends BaseTextareaProps, Omit<ComponentProps<'textarea'>, 'ref'> {}

export const BaseTextarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, hasChanges, isDirty, className, size, ...props }, ref) => {
    return (
      <label
        className={classNames(styles.wrapper, styles[size || 'small'], className, {
          [styles.touched]: isDirty,
          [styles.changes]: hasChanges,
        })}
      >
        <textarea
          className={styles.textarea}
          ref={ref}
          {...props}
        />

        <span className={styles.label}>{label}</span>
      </label>
    );
  },
);
