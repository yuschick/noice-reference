import {
  ApolloCache,
  ApolloError,
  BaseMutationOptions,
  DefaultContext,
  gql,
  MutationTuple,
  OperationVariables,
} from '@apollo/client';

import {
  useSocialSendFriendRequestMutation,
  FriendStatusUpdateProfileFragmentDoc,
  SocialSendFriendRequestMutation,
  SocialSendFriendRequestMutationVariables,
  FriendsListSentFriendRequestsResponse,
} from '@gen/graphql';
import { MarketingTracking } from '@lib/MarketingTracking';

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
  onCompleted,
  onError,
}: Props): MutationTuple<
  SocialSendFriendRequestMutation,
  SocialSendFriendRequestMutationVariables
> {
  return useSocialSendFriendRequestMutation({
    variables: undefined,
    update(cache, { data }, { variables }) {
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
        (existingProfile) => ({
          ...existingProfile,
          friendshipStatus: {
            ...existingProfile?.friendShipStatus,
            ...data?.sendFriendRequest?.friend?.friendshipStatus,
          },
        }),
      );

      // Add the friend request to the sent friend requests list
      cache.modify({
        fields: {
          sentFriendRequests(
            existingRequests: Partial<FriendsListSentFriendRequestsResponse>,
          ) {
            const newFriendRequest = cache.writeFragment({
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

            return {
              ...existingRequests,
              users: [...(existingRequests.users ?? []), newFriendRequest],
            };
          },
        },
      });
    },
    onCompleted: () => {
      MarketingTracking.trackEvent('added_a_friend');
      onCompleted?.();
    },
    onError,
  });
}
