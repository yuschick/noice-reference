import { gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { useMemo } from 'react';

import { NextUnlock } from '../NextUnlock/NextUnlock';
import { RewardTrack } from '../RewardTrack/RewardTrack';
import { SeasonsHeader } from '../SeasonsHeader/SeasonsHeader';

import { useSeasonsDataFilterIds } from './useSeasonsDataFilterIds';

import { useUseAllSeasonDataQuery, useSeasonsDataDailyXpBoostQuery } from '@gen';

gql`
  query UseAllSeasonData($seasonId: ID, $userId: ID) {
    seasonProgression(userId: $userId, seasonId: $seasonId) {
      seasonId
      ...RewardTrackSeasonProgression
      ...SeasonsHeaderProgression
    }

    rewards(userId: $userId) {
      rewards {
        id
        ...RewardTrackRewards
      }
    }

    listLevelConfigs(seasonId: $seasonId) {
      levelConfigs {
        ...RewardTrackLevelConfig
        ...NextUnlockLevelConfig
      }
    }
  }

  ${RewardTrack.fragments.progression}
  ${SeasonsHeader.fragments.progression}
  ${RewardTrack.fragments.rewards}
  ${RewardTrack.fragments.levelConfig}
  ${NextUnlock.fragments.levelConfig}
`;

gql`
  query SeasonsDataDailyXPBoost {
    dailyXPBoostLimit {
      remainingDailyXpBoost
    }
  }
`;

export function useSeasonsData() {
  const { userId } = useAuthenticatedUser();
  const { seasonId } = useSeasonsDataFilterIds();

  const { data: dailyXpBoostData, loading: dailyXpBoostDataLoading } =
    useSeasonsDataDailyXpBoostQuery();

  const { data: seasonData, loading: seasonDataLoading } = useUseAllSeasonDataQuery({
    variables: { userId, seasonId },
    skip: !seasonId,
    fetchPolicy: 'cache-and-network',
  });

  const nextCardLevel = useMemo(
    () =>
      seasonData?.listLevelConfigs?.levelConfigs.find(
        (levelConfig) =>
          levelConfig.rewards.some(
            (reward) =>
              reward.reward?.__typename === 'RewardRewardTypeItem' &&
              reward.reward.item.details?.__typename === 'GameLogicCard',
          ) && levelConfig.number > (seasonData?.seasonProgression?.level ?? 0),
      ),

    [seasonData?.listLevelConfigs?.levelConfigs, seasonData?.seasonProgression?.level],
  );

  return {
    progression: seasonData?.seasonProgression,
    rewards: seasonData?.rewards?.rewards,
    levelConfigs: seasonData?.listLevelConfigs?.levelConfigs,
    nextImportantLevel: nextCardLevel,
    loading: dailyXpBoostDataLoading || seasonDataLoading,
    remainingDailyXpBoost:
      dailyXpBoostData?.dailyXPBoostLimit?.remainingDailyXpBoost ?? 0,
  };
}
