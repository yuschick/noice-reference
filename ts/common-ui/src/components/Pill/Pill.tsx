import classNames from 'classnames';
import { CSSProperties, HTMLAttributes } from 'react';

import { Icon } from '../Icon';

import styles from './Pill.module.css';

import { SvgComponent } from '@common-types';

export const pillColors = [
  'gradient-green-teal',
  'gradient-violet-magenta',
  'gradient-violet',
  'blue-750',
  'blue-950',
  'gray-750',
  'gray-950',
  'light-main',
  'status-error-main',
] as const;

interface Props
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style' | 'title'> {
  label: string;
  color: (typeof pillColors)[number];
  iconEnd?: SvgComponent;
  iconStart?: SvgComponent;
  title?: string;
}

export function Pill({
  label,
  color,
  iconEnd,
  iconStart,
  title,
  ...htmlAttributes
}: Props) {
  const shouldUseDarkTextColor =
    color === 'gradient-green-teal' || color === 'light-main';

  return (
    <span
      {...htmlAttributes}
      className={classNames(styles.pill)}
      style={
        {
          '--_pill-background': color.startsWith('gradient')
            ? `var(--noi-${color})`
            : `var(--noi-color-${color})`,
          '--_pill-color': shouldUseDarkTextColor
            ? 'var(--noi-color-text-dark)'
            : 'var(--noi-color-text-light)',
        } as CSSProperties
      }
      title={title}
    >
      {iconStart && (
        <Icon
          icon={iconStart}
          size={16}
        />
      )}

      <span className={styles.text}>{label}</span>

      {iconEnd && (
        <Icon
          icon={iconEnd}
          size={16}
        />
      )}
    </span>
  );
}
