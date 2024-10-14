import { gql, MutationTuple } from '@apollo/client';

import {
  FriendStatusUpdateProfileFragmentDoc,
  FriendsFriendshipStatusStatus,
  useSocialRemoveFriendMutation,
  SocialRemoveFriendMutation,
  SocialRemoveFriendMutationVariables,
  FriendsListFriendsResponse,
} from '@gen/graphql';

gql`
  mutation SocialRemoveFriend($userId: ID!, $friendId: ID!) {
    removeFriend(userId: $userId, friendId: $friendId) {
      emptyTypeWorkaround
    }
  }
`;

interface Props {
  onCompleted?: () => void;
}

export function useRemoveFriendMutation({
  onCompleted,
}: Props): MutationTuple<
  SocialRemoveFriendMutation,
  SocialRemoveFriendMutationVariables
> {
  return useSocialRemoveFriendMutation({
    variables: undefined,
    update(cache, _result, { variables }) {
      const friendId = variables?.friendId;

      if (!friendId) {
        return;
      }

      // Update the profile friend status
      cache.updateFragment(
        {
          id: cache.identify({ userId: friendId, __typename: 'ProfileProfile' }),
          fragment: FriendStatusUpdateProfileFragmentDoc,
        },
        (existingProfile) => ({
          ...existingProfile,
          friendshipStatus: {
            ...existingProfile?.friendShipStatus,
            status: FriendsFriendshipStatusStatus.StatusUnspecified,
          },
        }),
      );

      // Remove the friend request from the received friend requests list
      cache.modify({
        fields: {
          friends(
            existingFriendsResponse: Partial<FriendsListFriendsResponse>,
            { readField },
          ) {
            return {
              ...existingFriendsResponse,
              users: existingFriendsResponse.users?.filter(
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
