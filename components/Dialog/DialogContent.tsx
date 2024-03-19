import { useContext } from 'react';

import styles from './Dialog.module.css';
import { DialogContext } from './DialogProvider';

import { WithChildren } from '@common-types';

export function DialogContent({ children }: WithChildren) {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('Dialog.Content can only be used within a Dialog.');
  }

  return <main className={styles.dialogContent}>{children}</main>;
}
