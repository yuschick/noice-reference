import { gql, MutationTuple } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { DeepPartial } from '@noice-com/utils';

import {
  FriendStatusUpdateProfileFragmentDoc,
  ProfileProfile,
  SocialUnblockUserMutation,
  SocialUnblockUserMutationVariables,
  useSocialUnblockUserMutation,
} from '@social-gen';

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
  profileUserId?: string;
  onCompleted?: () => void;
}

export function useUnblockUserMutation({
  profileUserId,
  onCompleted,
}: Props): MutationTuple<SocialUnblockUserMutation, SocialUnblockUserMutationVariables> {
  const { userId } = useAuthenticatedUser();

  return useSocialUnblockUserMutation({
    variables: profileUserId
      ? {
          userId,
          blockedUserId: profileUserId,
        }
      : undefined,
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
      cache.updateFragment<DeepPartial<ProfileProfile>>(
        {
          id: cache.identify({ userId: unblockedUserId, __typename: 'ProfileProfile' }),
          fragment: FriendStatusUpdateProfileFragmentDoc,
        },
        (existingProfile) => ({
          ...existingProfile,
          friendshipStatus: {
            ...existingProfile?.friendshipStatus,
            ...data?.unblockUser?.unblockedUser.friendshipStatus,
          },
        }),
      );
    },
    onCompleted,
  });
}
