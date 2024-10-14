import { gql } from '@apollo/client';

import { useUpdateUserAvatarMutation } from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';

gql`
  mutation UpdateUserAvatar($userId: ID!, $avatarId: ID!) {
    updateProfileAvatarV2(userId: $userId, modelId: $avatarId) {
      id
    }
  }
`;

export const useUpdateUserAvatar = () => {
  const { userId } = useAuth();

  const [mutateUpdateUserAvatar] = useUpdateUserAvatarMutation({
    update: (cache) => {
      const id = cache.identify({ __typename: 'ProfileProfile', userId: userId });

      // Note: Mutation returns AvatarAvatar which is missing props
      // that ProfileProfileAvatar needs so cant update cache directly.
      cache.evict({
        id,
        fieldName: 'avatarConfig',
        broadcast: true,
      });
      cache.evict({
        id,
        fieldName: 'avatars',
        broadcast: true,
      });
      cache.gc();
    },
  });

  const updateUserAvatar = async (avatarId: string) => {
    if (userId) {
      await mutateUpdateUserAvatar({
        variables: {
          userId,
          avatarId,
        },
      });
    }
  };

  return {
    updateUserAvatar,
  };
};
