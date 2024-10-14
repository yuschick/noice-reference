import classNames from 'classnames';
import { useRef } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

import { HTMLButtonAttributes } from '../Button/Button.types';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';

import styles from './InfoTooltip.module.css';

import { WithChildren } from '@common-types';

export interface Props extends Omit<HTMLButtonAttributes, 'color'> {
  className?: string;
  label: string;
  theme?: 'dark' | 'light';
}

export function InfoTooltip({
  children,
  theme = 'light',
  label,
  ...htmlAttributes
}: WithChildren<Props>) {
  const tooltipAnchor = useRef<HTMLButtonElement>(null);

  return (
    <Tooltip
      content={children}
      placement="top"
    >
      <button
        {...htmlAttributes}
        aria-label={label}
        className={classNames(styles.infoTooltipButton, styles[theme])}
        ref={tooltipAnchor}
      >
        <Icon
          icon={FaInfoCircle}
          size={24}
        />
      </button>
    </Tooltip>
  );
}
