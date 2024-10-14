import { gql, MutationTuple } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { DeepPartial } from '@noice-com/utils';

import {
  FriendStatusUpdateProfileFragmentDoc,
  FriendsFriendshipStatusStatus,
  SocialRemoveSentFriendRequestMutation,
  SocialRemoveSentFriendRequestMutationVariables,
  useSocialRemoveSentFriendRequestMutation,
  FriendsListSentFriendRequestsResponse,
  ProfileProfile,
} from '@social-gen';

gql`
  mutation SocialRemoveSentFriendRequest($userId: ID!, $friendId: ID!) {
    removeFriendRequest(userId: $friendId, friendId: $userId) {
      emptyTypeWorkaround
    }
  }
`;

interface Props {
  profileUserId?: string;
  onCompleted?: () => void;
}

export function useRemoveSentFriendRequestMutation({
  profileUserId,
  onCompleted,
}: Props): MutationTuple<
  SocialRemoveSentFriendRequestMutation,
  SocialRemoveSentFriendRequestMutationVariables
> {
  const { userId } = useAuthenticatedUser();

  return useSocialRemoveSentFriendRequestMutation({
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
