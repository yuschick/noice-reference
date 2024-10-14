import { gql, MutationTuple } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { DeepPartial } from '@noice-com/utils';

import { useSocialPackageInternal } from '@social-context';
import {
  FriendStatusUpdateProfileFragmentDoc,
  FriendsFriendshipStatusStatus,
  FriendsListReceivedFriendRequestsResponse,
  ProfileProfile,
  SocialRemoveReceivedFriendRequestMutation,
  SocialRemoveReceivedFriendRequestMutationVariables,
  useSocialRemoveReceivedFriendRequestMutation,
} from '@social-gen';

gql`
  mutation SocialRemoveReceivedFriendRequest($userId: ID!, $friendId: ID!) {
    removeFriendRequest(userId: $userId, friendId: $friendId) {
      emptyTypeWorkaround
    }
  }
`;

interface Props {
  profileUserId?: string;
  onCompleted?: () => void;
}

export function useRemoveReceivedFriendRequestMutation({
  profileUserId,
  onCompleted,
}: Props): MutationTuple<
  SocialRemoveReceivedFriendRequestMutation,
  SocialRemoveReceivedFriendRequestMutationVariables
> {
  const { userId } = useAuthenticatedUser();
  const { emitAPIEvent } = useSocialPackageInternal();

  return useSocialRemoveReceivedFriendRequestMutation({
    variables: profileUserId
      ? {
          userId,
          friendId: profileUserId,
        }
      : undefined,
    update(cache, _result, { variables }) {
      const friendId = variables?.friendId;

      if (!friendId) {
        return;
      }

      // Update the profile friend status
      cache.updateFragment<DeepPartial<ProfileProfile>>(
        {
          id: cache.identify({
            userId: friendId,
            __typename: 'ProfileProfile',
          }),
          fragment: FriendStatusUpdateProfileFragmentDoc,
        },
        (existingProfile) => {
          // If there is no longer profile, do nothing
          if (!existingProfile) {
            return existingProfile;
          }

          return {
            ...existingProfile,
            friendshipStatus: {
              ...existingProfile.friendshipStatus,
              status: FriendsFriendshipStatusStatus.StatusUnspecified,
            },
          };
        },
      );

      // Remove the friend request from the received friend requests list
      cache.modify({
        fields: {
          receivedFriendRequests(
            existingRequests: Partial<FriendsListReceivedFriendRequestsResponse>,
            { readField },
          ) {
            return {
              ...existingRequests,
              users: existingRequests.users?.filter(
                (user) => readField('userId', user) !== friendId,
              ),
            };
          },
        },
      });
    },
    onCompleted(_data, clientOptions) {
      if (clientOptions?.variables?.friendId) {
        emitAPIEvent('onFriendRequestRemoved', clientOptions.variables.friendId);
      }
      onCompleted?.();
    },
  });
}
