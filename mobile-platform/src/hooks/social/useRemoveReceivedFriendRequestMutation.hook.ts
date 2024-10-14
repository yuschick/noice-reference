import { gql, MutationTuple } from '@apollo/client';

import {
  FriendStatusUpdateProfileFragmentDoc,
  FriendsFriendshipStatusStatus,
  FriendsListReceivedFriendRequestsResponse,
  SocialRemoveReceivedFriendRequestMutation,
  SocialRemoveReceivedFriendRequestMutationVariables,
  useSocialRemoveReceivedFriendRequestMutation,
} from '@gen/graphql';

gql`
  mutation SocialRemoveReceivedFriendRequest($userId: ID!, $friendId: ID!) {
    removeFriendRequest(userId: $userId, friendId: $friendId) {
      emptyTypeWorkaround
    }
  }
`;

interface Props {
  onCompleted?: () => void;
}

export function useRemoveReceivedFriendRequestMutation({
  onCompleted,
}: Props): MutationTuple<
  SocialRemoveReceivedFriendRequestMutation,
  SocialRemoveReceivedFriendRequestMutationVariables
> {
  return useSocialRemoveReceivedFriendRequestMutation({
    variables: undefined,
    update(cache, _result, { variables }) {
      const friendId = variables?.friendId;

      if (!friendId) {
        return;
      }

      // Update the profile friend status
      cache.updateFragment(
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
              ...existingProfile.friendShipStatus,
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
    onCompleted(_data) {
      onCompleted?.();
    },
  });
}
