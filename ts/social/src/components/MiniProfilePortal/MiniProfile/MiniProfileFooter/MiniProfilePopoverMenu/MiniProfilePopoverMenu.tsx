import { gql } from '@apollo/client';
import {
  ConfirmDialog,
  PopoverMenu,
  useConfirmDialog,
  usePopoverMenu,
} from '@noice-com/common-ui';

import { useMiniProfileContext } from '../../../context';
import { shouldShowAddFriendButton } from '../utils';

import {
  FriendsFriendshipStatusStatus,
  MiniProfilePopoverMenuProfileFragment,
} from '@social-gen';
import {
  useGiveGiftButton,
  useRemoveFriendMutation,
  useSendFriendRequestMutation,
} from '@social-hooks';
import { GiftTarget } from '@social-types';

gql`
  fragment MiniProfilePopoverMenuChannelBan on ChannelUserBanStatus {
    banned
  }

  fragment MiniProfilePopoverMenuChatStatus on ChatGetChatUserStatusResponse {
    muted
  }

  fragment MiniProfilePopoverMenuProfile on ProfileProfile {
    userId
    userTag
    friendshipStatus {
      status
    }
    temporary
  }
`;

interface Props {
  store: ReturnType<typeof usePopoverMenu>;
  profile: MiniProfilePopoverMenuProfileFragment;
}

export function MiniProfilePopoverMenu({ store, profile }: Props) {
  const { userId: profileUserId, friendshipStatus, userTag, temporary } = profile;
  const { onBlockUser, onReportUser, showModerationButtons } = useMiniProfileContext();
  const showAddFriendButton = shouldShowAddFriendButton(
    friendshipStatus.status,
    !!temporary,
  );
  const { channelId } = useMiniProfileContext();
  const { showGiftButton, onGiftButtonClick } = useGiveGiftButton({
    target: GiftTarget.User,
    userId: profileUserId,
    channelId,
  });

  const [onRemoveFriend] = useRemoveFriendMutation({ profileUserId });
  const [onAddFriend] = useSendFriendRequestMutation({ profileUserId });
  const confirmDialog = useConfirmDialog({
    title: 'Remove Friend',
    description: `Are you sure you want to remove ${userTag} as a friend?`,
    onCancel: () => true,
    onConfirm: async () => {
      await onRemoveFriend();
    },
  });

  return (
    <>
      <PopoverMenu store={store}>
        {/* if moderation buttons are shown, so friend and gift button here */}
        {showModerationButtons && (showAddFriendButton || showGiftButton) && (
          <>
            <PopoverMenu.Section>
              {showAddFriendButton && (
                <PopoverMenu.Button onClick={() => onAddFriend()}>
                  Add Friend
                </PopoverMenu.Button>
              )}

              {showGiftButton && (
                <PopoverMenu.Button onClick={onGiftButtonClick}>
                  Gift sub
                </PopoverMenu.Button>
              )}
            </PopoverMenu.Section>

            <PopoverMenu.Divider />
          </>
        )}

        <PopoverMenu.Section>
          {friendshipStatus.status === FriendsFriendshipStatusStatus.StatusFriend && (
            <PopoverMenu.Button onClick={confirmDialog.actions.open}>
              Remove friend
            </PopoverMenu.Button>
          )}

          <PopoverMenu.Button onClick={onBlockUser}>Block User</PopoverMenu.Button>

          {onReportUser && (
            <PopoverMenu.Button onClick={onReportUser}>Report User</PopoverMenu.Button>
          )}
        </PopoverMenu.Section>
      </PopoverMenu>

      <ConfirmDialog store={confirmDialog} />
    </>
  );
}
