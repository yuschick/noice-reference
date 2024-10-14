import { gql, MutationTuple } from '@apollo/client';

import {
  FriendStatusUpdateProfileFragmentDoc,
  FriendsFriendshipStatusStatus,
  SocialRemoveSentFriendRequestMutation,
  SocialRemoveSentFriendRequestMutationVariables,
  useSocialRemoveSentFriendRequestMutation,
  FriendsListSentFriendRequestsResponse,
} from '@gen/graphql';

gql`
  mutation SocialRemoveSentFriendRequest($userId: ID!, $friendId: ID!) {
    removeFriendRequest(userId: $friendId, friendId: $userId) {
      emptyTypeWorkaround
    }
  }
`;

interface Props {
  onCompleted?: () => void;
}

export function useRemoveSentFriendRequestMutation({
  onCompleted,
}: Props): MutationTuple<
  SocialRemoveSentFriendRequestMutation,
  SocialRemoveSentFriendRequestMutationVariables
> {
  return useSocialRemoveSentFriendRequestMutation({
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

      // Remove the friend request from the sent friend requests list
      cache.modify({
        fields: {
          sentFriendRequests(
            existingRequests: Partial<FriendsListSentFriendRequestsResponse>,
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
    onCompleted,
  });
}
