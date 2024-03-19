import { useContext } from 'react';

import styles from './Dialog.module.css';
import { DialogContext } from './DialogProvider';

import { WithChildren } from '@common-types';

export function DialogActions({ children }: WithChildren) {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('Dialog.Actions can only be used within a Dialog.');
  }

  return <footer className={styles.dialogActions}>{children}</footer>;
}
