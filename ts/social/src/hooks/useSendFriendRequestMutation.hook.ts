import {
  ApolloCache,
  ApolloError,
  BaseMutationOptions,
  DefaultContext,
  gql,
  MutationTuple,
  OperationVariables,
} from '@apollo/client';
import { getFieldsVariables } from '@noice-com/apollo-client-utils';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { addNewFriendToExistingFriendList } from '@noice-com/social-react-core';
import { DeepPartial } from '@noice-com/utils';

import { useSocialPackageInternal } from '@social-context';
import {
  useSocialSendFriendRequestMutation,
  FriendStatusUpdateProfileFragmentDoc,
  SocialSendFriendRequestMutation,
  SocialSendFriendRequestMutationVariables,
  FriendsListSentFriendRequestsResponse,
  ProfileProfile,
  FriendsListReceivedFriendRequestsResponse,
  FriendsListFriendsResponse,
  QueryFriendsArgs,
} from '@social-gen';

gql`
  mutation SocialSendFriendRequest($userId: ID!, $friendId: ID!) {
    sendFriendRequest(userId: $userId, friendId: $friendId) {
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
  onError?(
    error: ApolloError,
    clientOptions?:
      | BaseMutationOptions<
          SocialSendFriendRequestMutation,
          OperationVariables,
          DefaultContext,
          ApolloCache<unknown>
        >
      | undefined,
  ): void;
}

export function useSendFriendRequestMutation({
  profileUserId,
  onCompleted,
  onError,
}: Props): MutationTuple<
  SocialSendFriendRequestMutation,
  SocialSendFriendRequestMutationVariables
> {
  const { userId } = useAuthenticatedUser();
  const { emitAPIEvent } = useSocialPackageInternal();

  return useSocialSendFriendRequestMutation({
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
            ...data?.sendFriendRequest?.friend?.friendshipStatus,
          },
        }),
      );

      let hasReceivedFriendRequestFromUser = false;

      // Check if there is a received friend request from the user, if so remove it from the received friend requests list
      cache.modify({
        fields: {
          receivedFriendRequests(
            existingRequests: DeepPartial<FriendsListReceivedFriendRequestsResponse>,
            { readField },
          ) {
            hasReceivedFriendRequestFromUser =
              existingRequests.users?.some(
                (user) => readField('userId', user) === friendId,
              ) ?? false;

            if (!hasReceivedFriendRequestFromUser) {
              return existingRequests;
            }

            return {
              ...existingRequests,
              users: existingRequests.users?.filter(
                (user) => readField('userId', user) !== friendId,
              ),
            };
          },
        },
      });

      const friendUserFragment = cache.writeFragment({
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

      // If there is a received friend request from the user,
      // add user to friend list but don't add the request to the sent friend requests list
      if (hasReceivedFriendRequestFromUser) {
        // Add the friend request to the sent friend requests list
        cache.modify({
          fields: {
            friends(
              existingFriendsResponse: DeepPartial<FriendsListFriendsResponse>,
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

              return addNewFriendToExistingFriendList(
                existingFriendsResponse,
                friendUserFragment,
                readField,
              );
            },
          },
        });
        return;
      }

      // Add the friend request to the sent friend requests list
      cache.modify({
        fields: {
          sentFriendRequests(
            existingRequests: DeepPartial<FriendsListSentFriendRequestsResponse>,
          ) {
            return {
              ...existingRequests,
              users: [...(existingRequests.users ?? []), friendUserFragment],
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
    onError,
  });
}
