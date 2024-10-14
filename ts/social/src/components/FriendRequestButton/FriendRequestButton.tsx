import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  Button,
  usePopoverMenu,
  PopoverMenu,
  useConfirmDialog,
  ConfirmDialog,
} from '@noice-com/common-ui';
import { DateAndTimeUtils } from '@noice-com/utils';

import {
  FriendRequestButtonProfileFragment,
  FriendsFriendshipStatus,
  FriendsFriendshipStatusStatus,
} from '@social-gen';
import {
  useAcceptFriendRequestMutation,
  useRemoveFriendMutation,
  useRemoveSentFriendRequestMutation,
  useSendFriendRequestMutation,
} from '@social-hooks';

export interface Props {
  profile: FriendRequestButtonProfileFragment;
}

const getButtonText = (friendshipStatus: FriendsFriendshipStatusStatus) => {
  if (friendshipStatus === FriendsFriendshipStatusStatus.StatusFriend) {
    return 'Friends';
  }

  if (friendshipStatus === FriendsFriendshipStatusStatus.StatusFriendRequestSent) {
    return 'Friend request sent';
  }

  if (friendshipStatus === FriendsFriendshipStatusStatus.StatusFriendRequestReceived) {
    return 'Accept friend request';
  }

  return 'Add friend';
};

const getButtonIcon = (friendshipStatus: FriendsFriendshipStatusStatus) => {
  if (friendshipStatus === FriendsFriendshipStatusStatus.StatusFriend) {
    return CoreAssets.Icons.PersonWithCheck;
  }

  return CoreAssets.Icons.PersonWithPlus;
};

const getPanelText = (friendshipStatus: FriendsFriendshipStatus, displayName: string) => {
  if (friendshipStatus.status === FriendsFriendshipStatusStatus.StatusFriendRequestSent) {
    return `${displayName} has not accepted your request yet`;
  }

  if (friendshipStatus.status === FriendsFriendshipStatusStatus.StatusFriend) {
    return `You have been friends since ${DateAndTimeUtils.getShortDate(
      friendshipStatus.lastStatusChange,
    )}`;
  }
};

export function FriendRequestButton({ profile }: Props) {
  const { userTag, friendshipStatus, userId: profileUserId, temporary } = profile;

  const popover = usePopoverMenu({ placement: 'bottom' });
  const confirmDialog = useConfirmDialog({
    title:
      friendshipStatus.status === FriendsFriendshipStatusStatus.StatusFriendRequestSent
        ? 'Cancel Friend Request'
        : `Remove Friend`,
    description:
      friendshipStatus.status === FriendsFriendshipStatusStatus.StatusFriendRequestSent
        ? 'Are you sure you want to cancel this friend request?'
        : `Are you sure you want to remove ${userTag} as a friend?`,
    onCancel: () => true,
    onConfirm: () => onPanelButtonClick(),
  });

  const [onAddFriend] = useSendFriendRequestMutation({
    profileUserId,
  });
  const [onAcceptFriend] = useAcceptFriendRequestMutation({ profileUserId });
  const [onCancelFriendRequest] = useRemoveSentFriendRequestMutation({
    profileUserId,
  });
  const [onRemoveFriend] = useRemoveFriendMutation({ profileUserId });

  const onButtonClick = () => {
    if (
      friendshipStatus.status === FriendsFriendshipStatusStatus.StatusFriendRequestSent ||
      friendshipStatus.status === FriendsFriendshipStatusStatus.StatusFriend
    ) {
      popover.actions.toggle();
      return;
    }

    if (
      friendshipStatus.status ===
      FriendsFriendshipStatusStatus.StatusFriendRequestReceived
    ) {
      onAcceptFriend();
      return;
    }

    onAddFriend();
  };

  const onPanelButtonClick = async () => {
    if (
      friendshipStatus.status === FriendsFriendshipStatusStatus.StatusFriendRequestSent
    ) {
      await onCancelFriendRequest();
      return;
    }

    await onRemoveFriend();
  };

  if (temporary) {
    return null;
  }

  return (
    <div>
      <Button
        iconStart={getButtonIcon(friendshipStatus.status)}
        level="secondary"
        ref={popover.state.popoverMenuTriggerRef}
        size="sm"
        onClick={onButtonClick}
      >
        {getButtonText(friendshipStatus.status)}
      </Button>

      <PopoverMenu store={popover}>
        <PopoverMenu.Section>
          <p>{getPanelText(friendshipStatus, userTag)}</p>
        </PopoverMenu.Section>

        <PopoverMenu.Section>
          <PopoverMenu.Button
            iconStart={CoreAssets.Icons.PersonWithCross}
            onClick={confirmDialog.actions.open}
          >
            {friendshipStatus.status ===
            FriendsFriendshipStatusStatus.StatusFriendRequestSent
              ? 'Cancel request'
              : 'Remove friend'}
          </PopoverMenu.Button>
        </PopoverMenu.Section>
      </PopoverMenu>

      <ConfirmDialog store={confirmDialog} />
    </div>
  );
}

FriendRequestButton.fragments = {
  entry: gql`
    fragment FriendRequestButtonProfile on ProfileProfile {
      userId
      userTag
      friendshipStatus {
        status
        lastStatusChange
      }
      temporary
    }
  `,
};
