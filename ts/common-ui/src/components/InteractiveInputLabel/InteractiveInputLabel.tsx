import classNames from 'classnames';
import { ReactNode } from 'react';

import { VisuallyHidden } from '../VisuallyHidden';

import styles from './InteractiveInputLabel.module.css';

interface Props {
  label: string | ReactNode;
  showLabel?: boolean;
  isDisabled?: boolean;
}

/**
 * Helper component for creating label for interactive inputs, like radio, checkbox, switch.
 * This is not meant to be used directly, but rather as a helper component for other components.
 */
export function InteractiveInputLabel({ label, showLabel, isDisabled }: Props) {
  if (showLabel) {
    // @todo: we will drop the ReactNode support very soon so this will be cleaner
    return typeof label === 'string' ? (
      <span className={classNames(styles.inputRoot, { [styles.disabled]: isDisabled })}>
        {label}
      </span>
    ) : (
      label
    );
  }

  return <VisuallyHidden>{label}</VisuallyHidden>;
}
