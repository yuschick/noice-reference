import { VisuallyHidden } from '@noice-com/common-ui';
import classNames from 'classnames';
import { ComponentProps } from 'react';
import { v4 as uuidv4 } from 'uuid';

import styles from './Toggle.module.css';

const TOGGLE_ID = `toggle-${uuidv4()}`;

export interface Props
  extends Omit<ComponentProps<'button'>, 'ref' | 'value' | 'onChange' | 'onClick'> {
  /** Defaults to medium */
  size?: 'small' | 'medium' | 'large';
  label: string;
  hideLabel?: boolean;
  value?: boolean;
  onText?: string;
  offText?: string;
  hasChanges?: boolean;
  onChange(value: boolean): void;
}

export function Toggle({
  value,
  label,
  hideLabel,
  size,
  onChange,
  onText,
  offText,
  hasChanges,
  className,
  ...props
}: Props) {
  return (
    <div
      className={classNames(styles.wrapper, styles[size || 'medium'], className, {
        [styles.off]: !value,
        [styles.on]: !!value,
        [styles.changes]: hasChanges,
      })}
    >
      <label className={styles.clickArea}>
        <button
          aria-checked={value ? 'true' : 'false'}
          aria-labelledby={TOGGLE_ID}
          className={styles.button}
          role="switch"
          type="button"
          {...props}
          onClick={() => onChange(!value)}
        >
          <span className={styles.dot} />
        </button>

        {hideLabel ? (
          <VisuallyHidden>{label}</VisuallyHidden>
        ) : (
          <span className={styles.label}>{label}</span>
        )}
      </label>

      <div className={styles.description}>{value ? onText : offText}</div>
    </div>
  );
}
