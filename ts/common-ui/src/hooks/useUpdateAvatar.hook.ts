import { MutationTuple, gql } from '@apollo/client';

import { useAuthentication } from '@common-context';
import {
  UpdateAvatarMutation,
  UpdateAvatarMutationVariables,
  useUpdateAvatarMutation,
} from '@common-gen';

gql`
  mutation UpdateAvatar($avatarId: ID!) {
    updateProfileAvatar(modelId: $avatarId) {
      emptyTypeWorkaround
    }
  }
`;

export function useUpdateAvatar(): MutationTuple<
  UpdateAvatarMutation,
  UpdateAvatarMutationVariables
> {
  const { userId } = useAuthentication();

  return useUpdateAvatarMutation({
    update: (cache) => {
      if (!userId) {
        return;
      }

      const id = cache.identify({
        userId,
        __typename: 'ProfileProfile',
      });

      // @todo: When our updateProfileAvatar response is improved, we can change these to cache updates
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
}
