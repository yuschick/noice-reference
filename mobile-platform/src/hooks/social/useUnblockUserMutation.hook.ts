import { gql, MutationTuple } from '@apollo/client';

import {
  FriendStatusUpdateProfileFragmentDoc,
  SocialUnblockUserMutation,
  SocialUnblockUserMutationVariables,
  useSocialUnblockUserMutation,
} from '@gen/graphql';

gql`
  mutation SocialUnblockUser($userId: ID!, $blockedUserId: ID!) {
    unblockUser(userId: $userId, blockedUserId: $blockedUserId) {
      unblockedUserId
      unblockedUser {
        ...FriendStatusUpdateProfile
      }
    }
  }
`;

interface Props {
  onCompleted?: () => void;
}

export function useUnblockUserMutation({
  onCompleted,
}: Props): MutationTuple<SocialUnblockUserMutation, SocialUnblockUserMutationVariables> {
  return useSocialUnblockUserMutation({
    variables: undefined,
    update(cache, { data }) {
      const unblockedUserId = data?.unblockUser?.unblockedUserId;

      if (!unblockedUserId) {
        return;
      }

      cache.modify({
        fields: {
          blockedUsers(
            existingBlockedUser: { users: { userId: string }[] } = { users: [] },
            { readField },
          ) {
            return {
              ...existingBlockedUser,
              users: existingBlockedUser.users.filter(
                (user) => readField('userId', user) !== unblockedUserId,
              ),
            };
          },
        },
      });
      cache.updateFragment(
        {
          id: cache.identify({ userId: unblockedUserId, __typename: 'ProfileProfile' }),
          fragment: FriendStatusUpdateProfileFragmentDoc,
        },
        (existingProfile) => ({
          ...existingProfile,
          friendshipStatus: {
            ...existingProfile.friendShipStatus,
            ...data?.unblockUser?.unblockedUser.friendshipStatus,
          },
        }),
      );
    },
    onCompleted,
  });
}
