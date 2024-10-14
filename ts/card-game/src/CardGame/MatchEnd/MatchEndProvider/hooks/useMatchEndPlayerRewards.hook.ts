import { useClient } from '@noice-com/common-react-core';
import { useAuthentication } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import {
  MatchRewards,
  PostMatchXPReward,
  PostMatchLevelReward,
  PostMatchWalletReward,
} from '../types';

import { useMatchEndRewardHandlers } from './useMatchEndRewardHandlers.hook';

export function useMatchEndPlayerRewards(): Nullable<MatchRewards> {
  const client = useClient();
  const { userId } = useAuthentication();

  const [xpRewards, setXpRewards] = useState<Nullable<PostMatchXPReward>>(null);
  const [levelRewards, setLevelRewards] = useState<Nullable<PostMatchLevelReward>>(null);
  const [walletRewards, setWalletRewards] =
    useState<Nullable<PostMatchWalletReward>>(null);

  const { getXpRewards, getLevelRewards, getWalletRewards } =
    useMatchEndRewardHandlers(userId);

  useEffect(() => {
    return client.NotificationService.notifications({
      async onProgressionUpdate(_, ev) {
        const xpRewards = await getXpRewards(ev);
        const levelRewards = await getLevelRewards(ev);

        if (xpRewards) {
          setXpRewards(xpRewards);
        }

        if (levelRewards) {
          setLevelRewards(levelRewards);
        }
      },
      async onWalletTransaction(_, ev) {
        const walletRewards = getWalletRewards(ev);

        if (walletRewards) {
          setWalletRewards(walletRewards);
        }
      },
    });
  }, [client.NotificationService, getLevelRewards, getWalletRewards, getXpRewards]);

  if (!xpRewards || !walletRewards || !levelRewards) {
    return null;
  }

  return {
    xpRewards,
    levelRewards,
    walletRewards,
  };
}
