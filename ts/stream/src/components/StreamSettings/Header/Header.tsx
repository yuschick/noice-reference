import { CoreAssets } from '@noice-com/assets-core';
import { IconButton } from '@noice-com/common-ui';

import styles from './Header.module.css';

interface Props {
  type: 'close' | 'back';
  onClose(): void;
  onBack(): void;
}

export function Header({ type, onClose, onBack }: Props) {
  return (
    <div className={styles.titleWrapper}>
      {type === 'close' ? (
        <>
          <legend className={styles.title}>Settings</legend>
          <IconButton
            icon={CoreAssets.Icons.Close}
            label="Close"
            level="secondary"
            size="xs"
            onClick={onClose}
          />
        </>
      ) : (
        <IconButton
          icon={CoreAssets.Icons.ChevronLeft}
          label="Back"
          level="secondary"
          size="xs"
          onClick={onBack}
        />
      )}
    </div>
  );
}
