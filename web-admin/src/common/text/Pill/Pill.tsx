import classNames from 'classnames';

import { PillType } from '../types';

import styles from './Pill.module.css';

export interface Props {
  /** defaults to default */
  type?: PillType;
  /** defaults to small */
  size?: 'small' | 'medium';
  text: string;
}

export function Pill({ type, size, text }: Props) {
  return (
    <div
      className={classNames(
        styles.pill,
        styles[type || 'default'],
        styles[size || 'small'],
      )}
    >
      <span className={styles.text}>{text}</span>
    </div>
  );
}
