import { FriendsFriendshipStatusStatus } from '@social-gen';

export const shouldShowAddFriendButton = (
  friendshipStatus: FriendsFriendshipStatusStatus,
  isTemporaryUser: boolean,
) => {
  if (isTemporaryUser) {
    return false;
  }

  return ![
    FriendsFriendshipStatusStatus.StatusFriend,
    FriendsFriendshipStatusStatus.StatusFriendRequestSent,
    FriendsFriendshipStatusStatus.StatusFriendRequestReceived,
  ].includes(friendshipStatus);
};
