import { gql, MutationTuple, Reference } from '@apollo/client';

import {
  FriendStatusUpdateProfileFragmentDoc,
  useSocialAcceptFriendRequestMutation,
  SocialAcceptFriendRequestMutation,
  SocialAcceptFriendRequestMutationVariables,
  FriendsListReceivedFriendRequestsResponse,
  FriendsListFriendsResponse,
  ProfilePresenceStatus,
} from '@gen/graphql';

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
  onCompleted?: () => void;
}

export function useAcceptFriendRequestMutation({
  onCompleted,
}: Props): MutationTuple<
  SocialAcceptFriendRequestMutation,
  SocialAcceptFriendRequestMutationVariables
> {
  return useSocialAcceptFriendRequestMutation({
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
            ...existingProfile.friendShipStatus,
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
            { readField },
          ) {
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

            return {
              ...existingFriendsResponse,
              users: [...(existingFriendsResponse.users ?? []), newFriendUser].sort(
                (a, z) => {
                  const aProfile = readField<Reference>('profile', a);
                  const zProfile = readField<Reference>('profile', z);
                  const aStatus = readField<ProfilePresenceStatus>(
                    'onlineStatus',
                    aProfile,
                  );
                  const zStatus = readField<ProfilePresenceStatus>(
                    'onlineStatus',
                    zProfile,
                  );

                  // If they are same, they are equal
                  if (aStatus === zStatus) {
                    return 0;
                  }

                  // If a is online, it should be first
                  if (aStatus === ProfilePresenceStatus.PresenceStatusOnline) {
                    return -1;
                  }

                  // If z is online, it should be first
                  if (zStatus === ProfilePresenceStatus.PresenceStatusOnline) {
                    return 1;
                  }

                  return 0;
                },
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
