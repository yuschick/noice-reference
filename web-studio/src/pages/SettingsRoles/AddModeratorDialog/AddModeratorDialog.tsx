import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import {
  ProfileImage,
  Button,
  Dialog,
  InputField,
  Icon,
  UseDialogResult,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

import styles from './AddModeratorDialog.module.css';

import { useChannelContext } from '@common/channel';
import {
  AuthPlatformRole,
  useModeratorDialogSuggestedUsersQuery,
  useModeratorDialogUsersQuery,
  useOnlineUsersQuery,
} from '@gen';

gql`
  query OnlineUsers($chatId: ID!) {
    chatUsers(
      chatId: $chatId
      userLabel: USER_LABEL_VIEWER
      sortBy: "lastActivity"
      limit: 10
    ) {
      users {
        user {
          userId
          account {
            uid
            roles
          }
        }
        userId
      }
    }
  }
  query ModeratorDialogUsers($userTags: [String!]) {
    resolveUserTags(userTags: $userTags) {
      profiles {
        userId
        userTag
        avatars {
          avatar2D
        }
        ...ProfileImageProfile
      }
    }
  }
`;

gql`
  query ModeratorDialogSuggestedUsers($userIds: [String!]) {
    profileBatch(userIds: $userIds) {
      profiles {
        userId
        userTag
        avatars {
          avatar2D
        }
        ...ProfileImageProfile
      }
    }
  }
`;

interface AddModeratorProps {
  dialog: UseDialogResult;
  myId: string;
  privilegedUsers: string[];
  onAdd: (userId: string) => void;
}

export function AddModeratorDialog({
  dialog,
  myId,
  onAdd,
  privilegedUsers,
}: AddModeratorProps) {
  const { channelChatId } = useChannelContext();
  const [userTag, setUserTag] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const { data: onlinePlayersData } = useOnlineUsersQuery({
    ...variablesOrSkip({ chatId: channelChatId }),
  });

  const suggestedPlayers = onlinePlayersData?.chatUsers?.users
    .filter(({ user }) =>
      user.account?.roles.includes(AuthPlatformRole.PlatformRoleFullUser),
    )
    .filter(({ userId }) => !privilegedUsers.includes(userId))
    .filter(({ userId }) => userId !== myId)
    .map(({ userId }) => userId);

  const { data: suggestedPlayersData } = useModeratorDialogSuggestedUsersQuery({
    ...variablesOrSkip({ userIds: suggestedPlayers }),
  });

  const { data } = useModeratorDialogUsersQuery({
    variables: {
      userTags: [userTag || ''],
    },
    skip: !userTag,
  });

  const profile = data?.resolveUserTags?.profiles?.[0];

  const handleAdd = () => {
    userId && onAdd(userId);
    dialog.actions.close();
  };

  useEffect(() => {
    setUserId(profile?.userId);
  }, [profile]);

  const users = suggestedPlayersData?.profileBatch?.profiles;

  return (
    <Dialog store={dialog}>
      <Dialog.Header />
      <Dialog.Close />

      <Dialog.Content>
        <InputField
          defaultValue={userTag || ''}
          label="Enter tag"
          type="text"
          onChange={(event) => setUserTag(event.target.value)}
        />

        {!!users?.length && (
          <div className={styles.alternativeList}>
            <span className={styles.alternativeText}>
              Or select a currently playing user from the list
            </span>

            {users.map((player) => (
              <button
                className={classNames(styles.playerOption, {
                  [styles.playerSelected]: player.userId === userId,
                })}
                key={player.userId}
                type="button"
                onClick={() =>
                  setUserId(userId === player.userId ? undefined : player.userId)
                }
              >
                <ProfileImage
                  profile={player}
                  size="xs"
                />
                {player.userTag}
              </button>
            ))}
          </div>
        )}

        {!!userTag && !userId && (
          <div className={styles.foundUser}>
            <Icon
              color="status-error-main"
              icon={CoreAssets.Icons.Alert}
            />
            No user with given tag
          </div>
        )}
      </Dialog.Content>

      <Dialog.Actions>
        <div className={styles.buttons}>
          <Button
            level="secondary"
            size="sm"
            theme="dark"
            onClick={dialog.actions.close}
          >
            Cancel
          </Button>
          <Button
            isDisabled={!userId}
            size="sm"
            variant="cta"
            onClick={handleAdd}
          >
            Add moderator
          </Button>
        </div>
      </Dialog.Actions>
    </Dialog>
  );
}
