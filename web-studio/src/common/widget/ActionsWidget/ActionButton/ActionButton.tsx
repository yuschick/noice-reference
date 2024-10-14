import classNames from 'classnames';
import { ButtonHTMLAttributes } from 'react';

import styles from './ActionButton.module.css';

interface Props
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'> {
  color: 'magenta' | 'teal' | 'violet';
}

export function ActionButton({ color, ...props }: Props) {
  return (
    <button
      className={classNames(styles.actionButton, styles[color])}
      {...props}
    />
  );
}
