import { gql } from '@apollo/client';
import {
  Anchor,
  Button,
  Dialog,
  NoiceSupportLinks,
  UsernameError,
  UsernameInputField,
  useAuthenticatedUser,
  useDialog,
} from '@noice-com/common-ui';
import { UsernameStatus } from '@noice-com/schemas/profile/profile.pb';
import { Nullable } from '@noice-com/utils';
import { RefObject, useId, useState } from 'react';

import styles from './UsernameEditFormDialog.module.css';

import { useProfileSettingUpdateUsernameMutation } from '@gen';

gql`
  mutation ProfileSettingUpdateUsername($userId: ID!, $userTag: String!) {
    updateProfile(body: { userId: $userId, userTag: $userTag }) {
      userId
      userTag
      canChangeUsernameAt
      usernameHistory(limit: 1) {
        reason
      }
    }
  }
`;

interface Props {
  formRef: RefObject<HTMLFormElement>;
  dialogStore: ReturnType<typeof useDialog>;
  username: string;
}

export function UsernameEditFormDialog({ dialogStore, username, formRef }: Props) {
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState<Nullable<UsernameError>>(null);

  const { userId } = useAuthenticatedUser();
  const editUsernameFormId = useId();

  const [updateProfile, { loading: updatingUsername }] =
    useProfileSettingUpdateUsernameMutation({
      onCompleted() {
        dialogStore.actions.close();
      },
      onError(error) {
        if (error.message === 'reserved username') {
          setUsernameError(UsernameStatus.USERNAME_STATUS_RESERVED);
          return;
        }

        if (error.message === 'unacceptable username') {
          setUsernameError(UsernameStatus.USERNAME_STATUS_GUIDELINES_VIOLATION);
          return;
        }

        setUsernameError(UsernameStatus.USERNAME_STATUS_UNSPECIFIED);
      },
    });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateProfile({
      variables: {
        userId,
        userTag: newUsername,
      },
    });
  };

  const onUsernameChange = (username: string) => {
    setNewUsername(username);
    setUsernameError(null);
  };

  return (
    <Dialog
      store={dialogStore}
      onClose={() => setUsernameError(null)}
    >
      <Dialog.Header />
      <Dialog.Close />
      <Dialog.Content>
        <form
          className={styles.usernameEditForm}
          id={editUsernameFormId}
          ref={formRef}
          onReset={() => dialogStore.actions.close()}
          onSubmit={onSubmit}
        >
          <div className={styles.currentUsernameWrapper}>
            <span>Current username</span>
            <span className={styles.currentUsername}>{username}</span>
          </div>

          <div className={styles.guidelineText}>
            Please review the{' '}
            <Anchor
              color="dark"
              href={NoiceSupportLinks.CommunityGuidelines}
            >
              Noice Community Guidelines
            </Anchor>{' '}
            before changing your username.
          </div>

          <UsernameInputField
            description="You can change your username once every 30 days."
            label="New username"
            usernameError={usernameError}
            onUsernameChange={onUsernameChange}
          />
        </form>
      </Dialog.Content>

      <Dialog.Actions>
        <Button
          form={editUsernameFormId}
          isLoading={updatingUsername}
          level="secondary"
          theme="dark"
          type="reset"
        >
          Cancel
        </Button>

        <Button
          form={editUsernameFormId}
          isLoading={updatingUsername}
          theme="dark"
          type="submit"
        >
          Change Username
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
