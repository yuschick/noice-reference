import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';

import { useProfileAccountMatureContentQuery } from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';

gql`
  query ProfileAccountMatureContent($userId: ID) {
    profile(userId: $userId) {
      userId
      account {
        matureRatedContentAllowed
      }
    }
  }
`;

export const useMatureRatedContentAllowed = () => {
  const { userId } = useAuth();
  const { data } = useProfileAccountMatureContentQuery({
    ...variablesOrSkip({ userId }),
  });

  return !!data?.profile?.account?.matureRatedContentAllowed;
};
