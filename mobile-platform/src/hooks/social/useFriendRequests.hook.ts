import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';

import { useFriendRequestsQuery } from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';

gql`
  query FriendRequests($userId: ID!) {
    receivedFriendRequests(userId: $userId) {
      users {
        userId
        lastStatusChange
      }
    }
    sentFriendRequests(userId: $userId) {
      users {
        userId
        lastStatusChange
      }
    }
  }
`;

export const useFriendRequests = () => {
  const { userId } = useAuth();
  const { data, refetch } = useFriendRequestsQuery({
    ...variablesOrSkip({ userId: userId }),
  });

  return {
    requests: data?.receivedFriendRequests?.users || [],
    refetch,
  };
};
