import { gql } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import {
  useAuthenticatedUser,
  NoiceSupportLinks,
  Button,
  useConfirmDialog,
  ConfirmDialog,
  Callout,
} from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import styles from './AccountDeleted.module.css';

import { Routes } from '@common/route';
import {
  ApiEntityState,
  AuthAccountStatusFlag,
  useAccountStateQuery,
  useCancelUserDeletionMutation,
} from '@gen';
import { NoAccessPage } from '@pages/common/NoAccessPage';

gql`
  query AccountState($userId: ID) {
    profile(userId: $userId) {
      userId
      account {
        uid
        state
        flags
      }
    }
  }

  mutation CancelUserDeletion {
    cancelDataDeletion {
      emptyTypeWorkaround
    }
  }
`;

export function AccountDeleted() {
  const [error, setError] = useState<Nullable<string>>(null);

  const { userId } = useAuthenticatedUser();
  const navigate = useNavigate();
  const client = useClient();

  const { loading } = useAccountStateQuery({
    variables: { userId },
    onCompleted(data) {
      if (
        data?.profile?.account?.state === ApiEntityState.EntityStateDeleted ||
        data.profile?.account?.flags.includes(
          AuthAccountStatusFlag.StatusFlagDeletionScheduled,
        )
      ) {
        return;
      }

      navigate(Routes.Home, { replace: true });
    },
  });

  const [cancelDeletion] = useCancelUserDeletionMutation({
    onCompleted: async () => {
      // Refresh the session to prevent a delay between the account being restored and the shcelued deletion UI
      await client.refreshAccessToken();

      navigate(Routes.Home, { replace: true });
    },
    onError: (error) => {
      setError(error.message);
      store.actions.close();
    },
  });

  const store = useConfirmDialog({
    title: 'Are you sure you want to cancel account deletion?',
    async onConfirm() {
      await cancelDeletion();
    },
    onCancel() {},
  });

  return (
    <NoAccessPage
      loading={loading}
      title="The account has been deleted"
    >
      <section className={styles.sectionWrapper}>
        <p>
          This account is now inactive, and all its associated data has been scheduled for
          deletion. Once the account is deleted, it cannot be recovered.
        </p>

        <p>
          If you have any questions regarding this, please contact support{' '}
          <a
            className={styles.email}
            href={`mailto:${NoiceSupportLinks.SupportEmail}`}
            rel="noreferrer"
            target="_blank"
            translate="no"
          >
            {NoiceSupportLinks.SupportEmail}
          </a>
        </p>

        <p>
          If you have changed your mind, you may cancel your account deletion within 30
          days of the initial request.
        </p>

        {!!error && (
          <Callout
            message={`Cancelling deletion failed: ${error}`}
            type="error"
          />
        )}

        <Button
          fit="content"
          level="secondary"
          size="xs"
          onClick={() => {
            store.actions.open();
            setError(null);
          }}
        >
          Cancel account deletion
        </Button>
      </section>

      <ConfirmDialog store={store} />
    </NoAccessPage>
  );
}
