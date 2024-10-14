import { gql } from '@apollo/client';
import { WalletCurrencyId, CommonUtils } from '@noice-com/common-ui';
import { useCallback, useEffect } from 'react';

import { RewardRewardTypeCurrency, usePickRateRewardsLazyQuery } from '@game-gen';
import { useCardGameState } from '@game-logic/game/context';

gql`
  query PickRateRewards($gameId: ID!) {
    challengeRewards(gameId: $gameId) {
      rewards {
        minPickRate
        maxPickRate
        reward {
          reward {
            ... on RewardRewardTypeCurrency {
              currencyId
              currencyAmount
            }
          }
        }
        gameId
      }
    }
  }
`;

interface HookResult {
  getReward: (pickRatePercentage: number) => {
    currencyId: WalletCurrencyId;
    amount: number;
  };
  isLoading: boolean;
}

export function usePickRateRewards(): HookResult {
  const gameInstance = useCardGameState();

  const [fetchData, { data }] = usePickRateRewardsLazyQuery();
  const rewards = data?.challengeRewards?.rewards;

  const getReward = useCallback(
    (pickRatePercentage: number) => {
      const reward = (rewards ?? []).find(
        (reward) =>
          pickRatePercentage >= reward.minPickRate &&
          pickRatePercentage <= reward.maxPickRate,
      );

      const rewardItem = reward?.reward.reward as RewardRewardTypeCurrency | undefined;
      const currencyId = rewardItem?.currencyId
        ? CommonUtils.getWalletCurrencyId(rewardItem.currencyId)
        : undefined;
      const amount = rewardItem?.currencyAmount;

      if (!currencyId || amount === undefined) {
        throw new Error(
          `Reward not found for pick rate: percentage=${pickRatePercentage}`,
        );
      }

      return {
        currencyId,
        amount,
      };
    },
    [rewards],
  );

  // Trigger fetching rewards
  useEffect(() => {
    if (!gameInstance) {
      return;
    }

    // We should need to fetch the rewards only once
    let fetched = false;

    const triggerFetchData = async () => {
      if (!gameInstance.getGameId() || fetched) {
        return;
      }

      fetched = true;
      fetchData({ variables: { gameId: gameInstance.getGameId() } });
    };

    triggerFetchData();

    gameInstance.addListener('onGameInit', triggerFetchData);

    return () => {
      gameInstance.removeListener('onGameInit', triggerFetchData);
    };
  }, [gameInstance, fetchData]);

  return {
    getReward,
    isLoading: !rewards,
  };
}
