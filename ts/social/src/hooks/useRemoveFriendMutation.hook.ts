import { gql, MutationTuple } from '@apollo/client';
import { getFieldsVariables } from '@noice-com/apollo-client-utils';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { DeepPartial } from '@noice-com/utils';

import {
  FriendStatusUpdateProfileFragmentDoc,
  FriendsFriendshipStatusStatus,
  useSocialRemoveFriendMutation,
  SocialRemoveFriendMutation,
  SocialRemoveFriendMutationVariables,
  FriendsListFriendsResponse,
  ProfileProfile,
  QueryFriendsArgs,
} from '@social-gen';

gql`
  mutation SocialRemoveFriend($userId: ID!, $friendId: ID!) {
    removeFriend(userId: $userId, friendId: $friendId) {
      emptyTypeWorkaround
    }
  }
`;

interface Props {
  profileUserId?: string;
  onCompleted?: () => void;
}

export function useRemoveFriendMutation({
  profileUserId,
  onCompleted,
}: Props): MutationTuple<
  SocialRemoveFriendMutation,
  SocialRemoveFriendMutationVariables
> {
  const { userId } = useAuthenticatedUser();

  return useSocialRemoveFriendMutation({
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
          id: cache.identify({ userId: friendId, __typename: 'ProfileProfile' }),
          fragment: FriendStatusUpdateProfileFragmentDoc,
        },
        (existingProfile) => ({
          ...existingProfile,
          friendshipStatus: {
            ...existingProfile?.friendshipStatus,
            status: FriendsFriendshipStatusStatus.StatusUnspecified,
          },
        }),
      );

      // Remove the friend request from the received friend requests list
      cache.modify({
        fields: {
          friends(
            existingFriendsResponse: Partial<FriendsListFriendsResponse>,
            { readField, storeFieldName, fieldName },
          ) {
            const { userId: friendListUserId } = getFieldsVariables<QueryFriendsArgs>(
              storeFieldName,
              fieldName,
            );

            // If the friend list is not for the current user, do not modify the cache
            if (friendListUserId !== userId) {
              return existingFriendsResponse;
            }

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
