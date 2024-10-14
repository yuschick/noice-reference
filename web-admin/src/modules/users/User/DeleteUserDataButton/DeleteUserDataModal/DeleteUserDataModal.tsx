import { gql } from '@apollo/client';
import { useState } from 'react';

import styles from './DeleteUserDataModal.module.css';

import { Button } from '@common/button';
import { ModalDialog } from '@common/dialog';
import { TextField } from '@common/input';
import { showSnackbar } from '@common/snackbar';
import { useDeleteUserMutation, UserDocument } from '@gen';

gql`
  mutation DeleteUser($userId: ID!) {
    deleteUserData(userId: $userId) {
      taskId
    }
  }
`;

interface Props {
  userId: string;
  userTag: string;
  onClose(): void;
}

export const DeleteUserDataModal = ({ userId, userTag, onClose }: Props) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [deleteUser] = useDeleteUserMutation({
    variables: { userId: userId },
    onError: (err) => {
      showSnackbar('error', `Failed to delete user. Reason: ${err.message}`);
    },
    onCompleted: () => {
      showSnackbar('info', 'User account is scheduled for deletion.');
      onClose();
    },
    refetchQueries: [UserDocument],
  });

  return (
    <ModalDialog
      title="Confirm delete user"
      isOpen
      onClose={onClose}
    >
      <div className={styles.confirmationMessage}>
        This will also delete the user&apos;s account. Are you sure you want to delete
        user {userTag}?
      </div>
      <TextField
        className={styles.confirmationInput}
        label="Type username to confirm deletion"
        placeholder={userTag}
        onChange={setConfirmationText}
      />
      <div className={styles.actions}>
        <Button
          buttonType="danger"
          disabled={confirmationText !== userTag}
          size="medium"
          text="Yes, delete user's account"
          onClick={() => {
            deleteUser();
          }}
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
};
