import { gql } from '@apollo/client';
import { DeepPartial } from 'react-hook-form';

import styles from './CancelDeletionModal.module.css';

import { Button } from '@common/button';
import { ModalDialog } from '@common/dialog';
import { showSnackbar } from '@common/snackbar';
import {
  AuthAccountStatusFlag,
  ProfileProfile,
  useCancelUserDeletionMutation,
} from '@gen';

gql`
  mutation CancelUserDeletion($userId: ID!) {
    cancelDataDeletion(userId: $userId) {
      emptyTypeWorkaround
    }
  }
`;

interface Props {
  userId: string;
  userTag: string;
  onClose(): void;
}

export function CancelDeletionModal({ userId, userTag, onClose }: Props) {
  const [cancelDeletion] = useCancelUserDeletionMutation({
    variables: { userId },
    onError: (err) => {
      showSnackbar('error', `Failed to cancel user deletion. Reason: ${err.message}`);
    },
    onCompleted: () => {
      showSnackbar('info', 'User account deletion has been cancelled.');
      onClose();
    },
    update: (cache) => {
      cache.updateFragment<DeepPartial<ProfileProfile>>(
        {
          id: cache.identify({ __typename: 'ProfileProfile', userId }),
          fragment: gql`
            fragment CancelDeletionMutationProfile on ProfileProfile {
              account {
                flags
              }
            }
          `,
        },
        (existing) => ({
          ...existing,
          account: {
            ...existing?.account,
            flags: existing?.account?.flags?.filter(
              (flag) => flag !== AuthAccountStatusFlag.StatusFlagDeletionScheduled,
            ),
          },
        }),
      );
    },
  });

  return (
    <ModalDialog
      title="Confirm deletion cancellation"
      isOpen
      onClose={onClose}
    >
      <div className={styles.confirmationMessage}>
        Are you sure you want to cancel the deletion of user {userTag}?
      </div>

      <div className={styles.actions}>
        <Button
          buttonType="primary"
          size="medium"
          text="Yes, cancel user's account deletion"
          onClick={() => cancelDeletion()}
        />

        <Button
          buttonType="ghost"
          color="red"
          size="medium"
          text="No"
          onClick={onClose}
        />
      </div>
    </ModalDialog>
  );
}
