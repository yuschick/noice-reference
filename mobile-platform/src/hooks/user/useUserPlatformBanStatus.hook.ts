import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useClient } from '@noice-com/common-react-core';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';

import { ModerationBanStatus, useUseUserPlatformBanQuery } from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';
import { useMountEffect } from '@hooks/useMountEffect.hook';
import { AuthenticatedNavigationHookProps } from '@navigators/routes';

gql`
  query useUserPlatformBan($userId: ID!) {
    platformBan(userId: $userId) {
      banId
      status
    }
  }
`;

export const useUserPlatformBanStatus = () => {
  const navigation = useNavigation<AuthenticatedNavigationHookProps>();
  const client = useClient();
  const { userId } = useAuth();
  const [isUserBanned, setIsUserBanned] = useState(false);

  const { data, loading } = useUseUserPlatformBanQuery({
    ...variablesOrSkip({ userId }),
    fetchPolicy: 'network-only',
  });

  useMountEffect(() => {
    client.NotificationService.notifications({
      onPlatformUserBanned: () => {
        setIsUserBanned(true);
      },
    });
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    if (data?.platformBan?.status === ModerationBanStatus.BanStatusActive) {
      setIsUserBanned(true);
    }
  }, [data, navigation]);

  return {
    isUserBanned,
    isLoading: loading,
  };
};
