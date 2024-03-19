import { useContext } from 'react';

import styles from './Dialog.module.css';
import { DialogContext } from './DialogProvider';

export function DialogHeader() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('Dialog.Header can only be used within a Dialog.');
  }

  const { state } = context;

  return (
    <header className={styles.dialogHeader}>
      <h1
        className={styles.dialogTitle}
        id={state.labelledById}
        tabIndex={-1}
      >
        {state.title}
      </h1>
    </header>
  );
}
