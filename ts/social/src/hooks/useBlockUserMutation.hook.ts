import { gql, MutationTuple } from '@apollo/client';
import { getFieldsVariables } from '@noice-com/apollo-client-utils';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { DeepPartial } from '@noice-com/utils';

import { useSocialPackageInternal } from '@social-context';
import {
  FriendsListFriendsResponse,
  FriendsListReceivedFriendRequestsResponse,
  FriendsListSentFriendRequestsResponse,
  FriendStatusUpdateProfileFragmentDoc,
  ProfileProfile,
  QueryFriendsArgs,
  SocialBlockUserMutation,
  SocialBlockUserMutationVariables,
  useSocialBlockUserMutation,
} from '@social-gen';

gql`
  mutation SocialBlockUser($userId: ID!, $blockedUserId: ID!) {
    blockUser(userId: $userId, blockedUserId: $blockedUserId) {
      blockedUserId
      blockedUser {
        ...FriendStatusUpdateProfile
      }
    }
  }
`;

interface Props {
  profileUserId?: string;
  onCompleted?: () => void;
}

export function useBlockUserMutation({
  profileUserId,
  onCompleted,
}: Props): MutationTuple<SocialBlockUserMutation, SocialBlockUserMutationVariables> {
  const { userId } = useAuthenticatedUser();
  const { emitAPIEvent } = useSocialPackageInternal();

  return useSocialBlockUserMutation({
    variables: profileUserId
      ? {
          userId,
          blockedUserId: profileUserId,
        }
      : undefined,
    update(cache, { data }, { variables }) {
      const blockedUserId = variables?.blockedUserId;

      if (!blockedUserId) {
        return;
      }

      cache.updateFragment<DeepPartial<ProfileProfile>>(
        {
          id: cache.identify({ userId: blockedUserId, __typename: 'ProfileProfile' }),
          fragment: FriendStatusUpdateProfileFragmentDoc,
        },
        (existingProfile) => ({
          ...existingProfile,
          friendshipStatus: {
            ...existingProfile?.friendshipStatus,
            ...data?.blockUser?.blockedUser.friendshipStatus,
          },
        }),
      );

      cache.modify({
        fields: {
          // Remove the friend request from the received friend requests list
          receivedFriendRequests(
            existingRequests: Partial<FriendsListReceivedFriendRequestsResponse>,
            { readField },
          ) {
            return {
              ...existingRequests,
              users: existingRequests.users?.filter(
                (user) => readField('userId', user) !== blockedUserId,
              ),
            };
          },
          // Remove the friend request from the sent friend requests list
          sentFriendRequests(
            existingRequests: Partial<FriendsListSentFriendRequestsResponse>,
            { readField },
          ) {
            return {
              ...existingRequests,
              users: existingRequests.users?.filter(
                (user) => readField('userId', user) !== blockedUserId,
              ),
            };
          },
          // Remove the friend request from the received friend requests list
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
                (user) => readField('userId', user) !== blockedUserId,
              ),
            };
          },
        },
      });
    },
    onCompleted(_data, clientOptions) {
      if (clientOptions?.variables?.blockedUserId) {
        emitAPIEvent('onProfileBlocked', clientOptions.variables.blockedUserId);
      }
      onCompleted?.();
    },
  });
}
