import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { Alert } from 'react-native';

import { useBlockUserMutation } from './useBlockUserMutation.hook';
import { useRemoveFriendMutation } from './useRemoveFriendMutation.hook';
import { useRemoveSentFriendRequestMutation } from './useRemoveSentFriendRequestMutation.hook';
import { useSendFriendRequestMutation } from './useSendFriendRequestMutation.hook';
import { useUnblockUserMutation } from './useUnblockUserMutation.hook';

import { FriendsFriendshipStatusStatus } from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';

type HookConfiguration = {
  friendshipStatus?: FriendsFriendshipStatusStatus;
};

export const useFriendship = ({ friendshipStatus }: HookConfiguration = {}) => {
  const { userId } = useAuth();
  const navigation = useNavigation();
  const [blockUser] = useBlockUserMutation({});
  const [unblockUser] = useUnblockUserMutation({});
  const [mutateSendFriendReq] = useSendFriendRequestMutation({});
  const [mutateRemoveFriend] = useRemoveFriendMutation({});
  const [mutateRemoveSentFriendReq] = useRemoveSentFriendRequestMutation({});

  const handleBlockingUser = async (blockedUserTag: string, blockedUserId: string) => {
    Alert.alert(
      `Block ${blockedUserTag}`,
      `Are you sure you want to block ${blockedUserTag}?`,
      [
        {
          style: 'destructive',
          text: 'Block',
          onPress: () => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }

            if (userId) {
              blockUser({
                variables: {
                  userId: userId,
                  blockedUserId: blockedUserId,
                },
              });
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };

  const handleUnblockingUser = (blockedUserId: string) => {
    if (userId) {
      unblockUser({
        variables: {
          userId,
          blockedUserId,
        },
      });
    }
  };

  const handleRequestingFriendship = (friendId: string) => {
    if (userId) {
      mutateSendFriendReq({
        variables: {
          userId,
          friendId: friendId,
        },
      });
    }
  };

  const handleRemovingSentFriendRequest = (friendId: string) => {
    if (userId) {
      mutateRemoveSentFriendReq({
        variables: {
          userId,
          friendId,
        },
      });
    }
  };

  const handleRemovingFriendship = (friendId: string, friendUserTag: string) => {
    Alert.alert(
      `Remove ${friendUserTag} from friends`,
      `Are you sure you want to remove ${friendUserTag}?`,
      [
        {
          style: 'destructive',
          text: 'Remove',
          onPress: () => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }

            if (userId) {
              mutateRemoveFriend({
                variables: {
                  userId,
                  friendId,
                },
              });
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };
  const actionLabel = useMemo(() => {
    switch (friendshipStatus) {
      case FriendsFriendshipStatusStatus.StatusFriend:
        return 'Friends';

      case FriendsFriendshipStatusStatus.StatusBlocked:
      case FriendsFriendshipStatusStatus.StatusBlockedBy:
        return 'Blocked';

      case FriendsFriendshipStatusStatus.StatusFriendRequestReceived:
        return 'Accept request';

      case FriendsFriendshipStatusStatus.StatusFriendRequestSent:
        return 'Cancel request';

      default:
        return !friendshipStatus ? undefined : 'Add friend';
    }
  }, [friendshipStatus]);

  const { isBlocked, isFriends, isPendingRequest, isPendingReceivedRequest } = {
    isBlocked: friendshipStatus === FriendsFriendshipStatusStatus.StatusBlocked,
    isFriends: friendshipStatus === FriendsFriendshipStatusStatus.StatusFriend,
    isPendingRequest:
      friendshipStatus === FriendsFriendshipStatusStatus.StatusFriendRequestSent,
    isPendingReceivedRequest:
      friendshipStatus === FriendsFriendshipStatusStatus.StatusFriendRequestReceived,
  };

  return {
    actionLabel,
    handleBlockingUser,
    handleUnblockingUser,
    handleRequestingFriendship,
    handleRemovingFriendship,
    handleRemovingSentFriendRequest,
    isBlocked,
    isFriends,
    isPendingRequest,
    isPendingReceivedRequest,
  };
};
