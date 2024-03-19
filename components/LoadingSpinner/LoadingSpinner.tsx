import { CSSProperties, HTMLAttributes, forwardRef } from 'react';

import { VisuallyHidden } from '../VisuallyHidden';

import styles from './LoadingSpinner.module.css';

export const loadingSpinnerSizes = ['sm', 'md', 'lg'] as const;

interface Props
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'role' | 'style'> {
  /**
   * Override the default (md) size of the spinner
   */
  size?: (typeof loadingSpinnerSizes)[number];
}

export const LoadingSpinner = forwardRef<HTMLDivElement, Props>(
  ({ size = 'md', ...htmlAttributes }, externalRef) => {
    return (
      <div
        ref={externalRef}
        {...htmlAttributes}
      >
        <div
          className={styles.loadingSpinner}
          role="status"
          style={
            {
              '--loading-spinner-size': `var(--loading-spinner-size-${size})`,
            } as CSSProperties
          }
        >
          <VisuallyHidden>Loading...</VisuallyHidden>
        </div>

        {/* Fallback for environments with reduced motion settings enabled */}
        <span
          className={styles.loadingTextFallback}
          role="status"
        >
          Loading...
        </span>
      </div>
    );
  },
);

LoadingSpinner.displayName = 'LoadingSpinner';
