import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { ConfirmDialog, IconButton, useConfirmDialog } from '@noice-com/common-ui';

import {
  FriendsFriendshipStatusStatus,
  FriendsSidebarFriendButtonsProfileFragment,
} from '@social-gen';
import {
  useAcceptFriendRequestMutation,
  useRemoveReceivedFriendRequestMutation,
  useRemoveSentFriendRequestMutation,
} from '@social-hooks';

interface Props {
  profile: FriendsSidebarFriendButtonsProfileFragment;
}

export function FriendsSidebarFriendButtons({ profile }: Props) {
  const cancelConfirmDialog = useConfirmDialog({
    title: 'Cancel friend request',
    description: 'Are you sure you want to cancel this friend request?',
    onCancel: () => {},
    onConfirm: () => removeSentFriendRequest(),
  });
  const [acceptFriendRequest] = useAcceptFriendRequestMutation({
    profileUserId: profile.userId,
  });
  const [removeSentFriendRequest] = useRemoveSentFriendRequestMutation({
    profileUserId: profile.userId,
  });
  const [removeReceivedFriendRequest] = useRemoveReceivedFriendRequestMutation({
    profileUserId: profile.userId,
  });

  if (
    profile.friendshipStatus.status !==
      FriendsFriendshipStatusStatus.StatusFriendRequestSent &&
    profile.friendshipStatus.status !==
      FriendsFriendshipStatusStatus.StatusFriendRequestReceived
  ) {
    return null;
  }

  if (
    profile.friendshipStatus.status ===
    FriendsFriendshipStatusStatus.StatusFriendRequestSent
  ) {
    return (
      <>
        <ConfirmDialog store={cancelConfirmDialog} />
        <IconButton
          icon={CoreAssets.Icons.Close}
          label="Cancel friend request"
          level="secondary"
          size="sm"
          onClick={cancelConfirmDialog.actions.open}
        />
      </>
    );
  }

  return (
    <>
      <IconButton
        icon={CoreAssets.Icons.CheckThin}
        label="Accept friend request"
        level="secondary"
        size="sm"
        onClick={() => acceptFriendRequest()}
      />

      <IconButton
        icon={CoreAssets.Icons.Close}
        label="Remove friend request"
        level="secondary"
        size="sm"
        onClick={() => removeReceivedFriendRequest()}
      />
    </>
  );
}

FriendsSidebarFriendButtons.fragments = {
  entry: gql`
    fragment FriendsSidebarFriendButtonsProfile on ProfileProfile {
      userId
      friendshipStatus {
        status
      }
    }
  `,
};
