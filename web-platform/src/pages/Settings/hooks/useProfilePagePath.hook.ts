import { gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { useMemo } from 'react';

import { generateProfileLink } from '@common/profile';
import { useProfilePagePathQuery } from '@gen';

gql`
  query ProfilePagePath($userId: ID!) {
    profile(userId: $userId) {
      userId
      userTag
    }
  }
`;

export function useProfilePagePath(): string {
  const { userId } = useAuthenticatedUser();

  const { data } = useProfilePagePathQuery({
    variables: {
      userId,
    },
  });

  const path = useMemo(() => {
    if (!data?.profile?.userTag) {
      return '';
    }

    return generateProfileLink(data.profile.userTag);
  }, [data?.profile?.userTag]);

  return path;
}
