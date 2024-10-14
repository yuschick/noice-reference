import { gql } from '@apollo/client';
import { Button, ConfirmDialog, useConfirmDialog } from '@noice-com/common-ui';
import { useNavigate } from 'react-router';

import styles from '../Account.module.css';

import { Routes } from '@common/route';
import { useDeleteOwnAccountMutation } from '@gen';

gql`
  mutation DeleteOwnAccount {
    deleteUserData {
      taskId
    }
  }
`;

export function DeleteYourAccountButton() {
  const navigate = useNavigate();

  const [deleteOwnAccount] = useDeleteOwnAccountMutation({
    onCompleted: () => {
      navigate(Routes.Logout, { replace: true });
    },
  });
  const confirmDialog = useConfirmDialog({
    title: 'Confirm account deletion',
    description:
      "If you continue with this, it will delete all your account data and you will no longer be able to use Noice. Are you sure you'd like to continue?",
    onConfirm: [
      async () => {
        await deleteOwnAccount();
      },
      { label: 'Delete account' },
    ],
    onCancel: [() => confirmDialog.actions.close(), { label: 'Cancel' }],
  });

  return (
    <div>
      <div className={styles.button}>
        <Button
          level="secondary"
          onClick={() => {
            confirmDialog.actions.open();
          }}
        >
          Delete your account
        </Button>
      </div>
      <ConfirmDialog store={confirmDialog} />
    </div>
  );
}
