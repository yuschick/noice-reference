import { CSSProperties, HTMLAttributes, forwardRef } from 'react';

import styles from './StatusIndicator.module.css';

interface Props
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'aria-label' | 'aria-live' | 'className' | 'role' | 'style'
  > {
  color: 'green' | 'magenta';
  message: string;
}

export const StatusIndicator = forwardRef<HTMLDivElement, Props>(
  ({ color, message, ...htmlAttributes }, externalRef) => {
    return (
      <div
        aria-label={message}
        aria-live="polite"
        className={styles.statusIndicator}
        ref={externalRef}
        role="status"
        style={
          {
            '--status-indicator-color': `var(--noi-color-${color}-main)`,
          } as CSSProperties
        }
        {...htmlAttributes}
      />
    );
  },
);
