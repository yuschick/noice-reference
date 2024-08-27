import { ButtonHTMLAttributes } from 'react';

import { Icon } from '../Icon';

import styles from './SegmentedControl.module.css';

import { SvgComponent, WithChildren } from '@common-types';

interface Props
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'aria-current' | 'className' | 'color' | 'disabled' | 'style'
  > {
  iconStart?: SvgComponent;
  isSelected?: boolean;
}

export function SegmentedControlButton({
  children,
  iconStart,
  isSelected,
  onClick,
  ...htmlAttributes
}: WithChildren<Props>) {
  return (
    <button
      {...htmlAttributes}
      aria-current={isSelected}
      className={styles.segmentedControl}
      type="button"
      onClick={onClick}
    >
      {!!iconStart && (
        <Icon
          color="text-light"
          icon={iconStart}
          size={16}
        />
      )}

      <div>{children}</div>
    </button>
  );
}
