import { gql, MutationTuple } from '@apollo/client';
import { getFieldsVariables } from '@noice-com/apollo-client-utils';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { addNewFriendToExistingFriendList } from '@noice-com/social-react-core';
import { DeepPartial } from '@noice-com/utils';

import { useSocialPackageInternal } from '@social-context';
import {
  FriendStatusUpdateProfileFragmentDoc,
  useSocialAcceptFriendRequestMutation,
  SocialAcceptFriendRequestMutation,
  SocialAcceptFriendRequestMutationVariables,
  FriendsListReceivedFriendRequestsResponse,
  FriendsListFriendsResponse,
  ProfileProfile,
  QueryFriendsArgs,
} from '@social-gen';

gql`
  mutation SocialAcceptFriendRequest($userId: ID!, $friendId: ID!) {
    acceptFriendRequest(userId: $userId, friendId: $friendId) {
      friendId
      friend {
        ...FriendStatusUpdateProfile
      }
    }
  }
`;

interface Props {
  profileUserId?: string;
  onCompleted?: () => void;
}

export function useAcceptFriendRequestMutation({
  profileUserId,
  onCompleted,
}: Props): MutationTuple<
  SocialAcceptFriendRequestMutation,
  SocialAcceptFriendRequestMutationVariables
> {
  const { userId } = useAuthenticatedUser();
  const { emitAPIEvent } = useSocialPackageInternal();

  return useSocialAcceptFriendRequestMutation({
    variables: profileUserId
      ? {
          userId,
          friendId: profileUserId,
        }
      : undefined,
    update(cache, { data }, { variables }) {
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
        (existingProfile) => ({
          ...existingProfile,
          friendshipStatus: {
            ...existingProfile?.friendshipStatus,
            ...data?.acceptFriendRequest?.friend?.friendshipStatus,
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
                (user) => readField('userId', user) !== friendId,
              ),
            };
          },
          // Add the friend to the friends list
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

            // If the friend is already in the list, don't add it again
            if (
              (existingFriendsResponse.users?.findIndex(
                (user) => readField('userId', user) === friendId,
              ) ?? -1) >= 0
            ) {
              return existingFriendsResponse;
            }

            const newFriendUser = cache.writeFragment({
              id: cache.identify({
                userId: friendId,
                __typename: 'FriendsUser',
              }),
              data: { userId: friendId },
              fragment: gql`
                fragment NewFriendRequestUser on FriendsUser {
                  userId
                }
              `,
            });

            return addNewFriendToExistingFriendList(
              existingFriendsResponse,
              newFriendUser,
              readField,
            );
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
