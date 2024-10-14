import { Button, Dialog, UseDialogResult } from '@noice-com/common-ui';
import { ReactNode } from 'react';

import styles from './ActionDialog.module.css';

export interface AvatarEditorActionDialogProps {
  title: string;
  description: string | ReactNode;
  dialogStore: UseDialogResult;
  onYesClicked(): void;
}

export function ActionDialog({
  title,
  description,
  dialogStore,
  onYesClicked,
}: AvatarEditorActionDialogProps) {
  const handleClickYes = () => {
    dialogStore.actions.close();
    onYesClicked();
  };

  return (
    <Dialog store={dialogStore}>
      <Dialog.Content>
        <div className={styles.avatarEditorDialogContentWrapper}>
          <span className={styles.avatarEditorDialogHeader}>{title}</span>
          <span className={styles.avatarEditorDialogDescription}>{description}</span>
        </div>
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          level="secondary"
          shape="pill"
          size="sm"
          theme="dark"
          onClick={dialogStore.actions.close}
        >
          No
        </Button>
        <Button
          shape="pill"
          size="sm"
          theme="dark"
          onClick={handleClickYes}
        >
          Yes
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
