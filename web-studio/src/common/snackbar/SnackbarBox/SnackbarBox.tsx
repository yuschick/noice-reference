import { CoreAssets } from '@noice-com/assets-core';
import { IconButton } from '@noice-com/common-ui';
import { useState } from 'react';

import styles from './SnackbarBox.module.css';

interface SnackbarBoxProps {
  message: string;
}

export function SnackbarBox({ message }: SnackbarBoxProps) {
  const [hidden, setHidden] = useState(false);

  if (hidden) {
    return null;
  }

  return (
    <div className={styles.snackbar}>
      <div className={styles.message}>{message}</div>
      <IconButton
        icon={CoreAssets.Icons.Close}
        label="Close"
        size="sm"
        variant="ghost"
        onClick={() => setHidden(true)}
      />
    </div>
  );
}
