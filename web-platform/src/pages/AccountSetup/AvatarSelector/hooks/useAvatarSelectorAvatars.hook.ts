import { gql } from '@apollo/client';

import { UseAvatarSelectorAvatarFragment, useUseAvatarSelectorAvatarsQuery } from '@gen';

gql`
  fragment UseAvatarSelectorAvatar on AvatarAvatar {
    id
    gender
    avatar3D
    body
    ...AvatarSelectorGridAvatar
  }

  query UseAvatarSelectorAvatars {
    avatars {
      avatars {
        ...UseAvatarSelectorAvatar
      }
    }
  }
`;

interface HookResult {
  avatars: UseAvatarSelectorAvatarFragment[];
  loading: boolean;
}

export function useAvatarSelectorAvatars(): HookResult {
  const { data, loading } = useUseAvatarSelectorAvatarsQuery();

  return {
    avatars: data?.avatars?.avatars.map((avatar) => avatar).reverse() ?? [],
    loading,
  };
}
