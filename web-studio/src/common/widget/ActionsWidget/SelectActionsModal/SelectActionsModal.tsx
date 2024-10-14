import { Button, Checkbox, Dialog, UseDialogResult } from '@noice-com/common-ui';

import { ActionType } from '../../types';

import styles from './SelectActionsModal.module.css';

interface SelectActionsModalProps {
  dialog: UseDialogResult;
  enabledActions: ActionType[];
  availableActions: ActionType[];
  toggleAction: (id: ActionType) => void;
}

const actionLabels: Record<ActionType, string> = {
  [ActionType.StreamInfo]: 'Edit stream info',
  [ActionType.CameraDriveTransition]: 'Intermission start/stop',
};

export function SelectActionsModal({
  dialog,
  availableActions,
  enabledActions,
  toggleAction,
}: SelectActionsModalProps) {
  return (
    <Dialog store={dialog}>
      <Dialog.Header />
      <Dialog.Close />
      <Dialog.Content>
        <ul className={styles.modalActions}>
          {availableActions.map((action, index) => {
            return (
              <li
                className={styles.availableAction}
                key={index}
              >
                <Checkbox
                  checked={enabledActions.includes(action)}
                  label={actionLabels[action]}
                  name="action"
                  onChange={() => toggleAction(action)}
                />
              </li>
            );
          })}
        </ul>
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          variant="cta"
          onClick={dialog.actions.close}
        >
          Done
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
