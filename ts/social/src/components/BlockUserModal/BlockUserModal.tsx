import { ApolloError, gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { ProfileImage, useDialog, Dialog, Button, Icon } from '@noice-com/common-ui';
import { useEffect } from 'react';

import styles from './BlockUserModal.module.css';

import { BlockUserProfileFragment } from '@social-gen';

interface Props {
  error?: ApolloError;
  processing?: boolean;
  profile: BlockUserProfileFragment;
  success?: boolean;
  onBlock(): void;
  onDismiss(): void;
}

export function BlockUserModal({
  error,
  profile,
  onBlock,
  onDismiss,
  processing,
  success,
}: Props) {
  const dialog = useDialog({
    initialState: 'open',
    title: 'Block user',
    onClose: onDismiss,
  });
  const { close } = dialog.actions;

  useEffect(() => {
    if (success) {
      close();
    }
  }, [success, close]);

  return (
    <Dialog store={dialog}>
      <Dialog.Header />
      <Dialog.Content>
        <div className={styles.content}>
          <div className={styles.user}>
            <span>You are blocking:</span>
            <ProfileImage
              profile={profile}
              size="lg"
            />
            <div>
              <span className={styles.displayName}>{profile.userTag}</span>
            </div>
          </div>
          <div className={styles.description}>
            <p>Blocking a user will:</p>
            <ul className={styles.consequences}>
              <li>Prevent them from seeing your profile</li>
              <li>Prevent both of you from seeing each other in chat or leaderboard</li>
              <li>Prevent them from being in the same team or party as you</li>
            </ul>
          </div>

          {!!error?.message && (
            <div className={styles.error}>
              <Icon
                className={styles.iconError}
                icon={CoreAssets.Icons.Alert}
              />
              {error.message}
            </div>
          )}
        </div>
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          isDisabled={processing}
          level="secondary"
          theme="dark"
          onClick={onDismiss}
        >
          Cancel
        </Button>
        <Button
          isLoading={processing}
          theme="dark"
          onClick={onBlock}
        >
          Block User
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}

BlockUserModal.fragments = {
  entry: gql`
    fragment BlockUserProfile on ProfileProfile {
      avatars {
        avatar2D
      }
      userTag
      ...ProfileImageProfile
    }
  `,
};
