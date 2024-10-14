import classNames from 'classnames';

import { SnackbarType } from '../types';

import styles from './Snackbar.module.css';

export interface Props {
  type: SnackbarType;
  text: string;
}

export function Snackbar({ type, text }: Props) {
  return (
    <div className={classNames(styles.wrapper, styles[type || 'default'])}>{text}</div>
  );
}
