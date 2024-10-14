import { gql } from '@apollo/client';
import { WalletCurrencyId } from '@noice-com/common-ui';
import { ProgressionUpdateEvent } from '@noice-com/schemas/progression/progression.pb';
import { ReasonMetadataField, Reason } from '@noice-com/schemas/reason/reason.pb';
import { OperationType, TransactionEvent } from '@noice-com/schemas/wallet/wallet.pb';
import { Nullable, makeLoggers } from '@noice-com/utils';
import { useCallback } from 'react';

import { PostMatchXPReward, PostMatchLevelReward, PostMatchWalletReward } from '../types';

import {
  useGetMatchEndDailyBoostLazyQuery,
  useGetMatchEndLevelThresholdsLazyQuery,
  useGetMatchEndPlayerLevelLazyQuery,
} from '@game-gen';

const { logWarn, logInfoVerbose } = makeLoggers(`CardGame::useMatchEndPlayerRewards`);

gql`
  query GetMatchEndDailyBoost {
    dailyXPBoostLimit {
      remainingDailyXpBoost
    }
  }

  query GetMatchEndLevelThresholds($seasonId: ID!, $startLevel: Int!, $endLevel: Int!) {
    listLevelConfigs(seasonId: $seasonId, minLevel: $startLevel, maxLevel: $endLevel) {
      levelConfigs {
        ...MatchEndLevelThresholds
      }
    }
  }

  fragment MatchEndLevelThresholds on ProgressionLevelConfig {
    threshold
  }

  query GetMatchEndPlayerLevel($userId: ID!, $seasonId: ID!) {
    seasonProgression(userId: $userId, seasonId: $seasonId) {
      ...MatchEndPlayerLevel
    }
  }

  fragment MatchEndPlayerLevel on ProgressionSeasonProgression {
    level
    nextLevel
  }
`;

const getMetaDataValue = (field: ReasonMetadataField, reason?: Reason): number =>
  reason?.metadata?.value?.[field]?.intValue ?? 0;

const toNumberOrZero = (value: string | undefined): number => parseInt(value ?? `0`, 10);

export function useMatchEndRewardHandlers(userId: Nullable<string>) {
  const [fetchRemainingBoost] = useGetMatchEndDailyBoostLazyQuery();
  const [fetchPlayerLevel] = useGetMatchEndPlayerLevelLazyQuery();
  const [fetchLevelThresholds] = useGetMatchEndLevelThresholdsLazyQuery();

  const getXpRewards = useCallback(
    async (ev: ProgressionUpdateEvent): Promise<Nullable<PostMatchXPReward>> => {
      // Ignore non-match end messages
      if (!ev.reason?.matchEnd || ev.updates?.length === 0) {
        return null;
      }

      logInfoVerbose(`Match end progression received:`, ev);

      // Bonuses
      const teamPlayerBonus = getMetaDataValue(
        ReasonMetadataField.TEAM_PLAYER_BONUS_XP,
        ev.reason,
      );
      const participationBonus = getMetaDataValue(
        ReasonMetadataField.PARTICIPATION_BONUS_XP,
        ev.reason,
      );
      const dailyBoost = getMetaDataValue(ReasonMetadataField.DAILY_BOOST_XP, ev.reason);
      const bonusTotal = teamPlayerBonus + participationBonus + dailyBoost;

      let remainingDailyBoost = 0;
      try {
        const { data: boostData } = await fetchRemainingBoost();
        remainingDailyBoost = boostData?.dailyXPBoostLimit?.remainingDailyXpBoost ?? 0;
      } catch (err) {
        logWarn(`failed to fetch remaining daily boost:`, err);
      }

      // Totals
      const xpNewTotal = toNumberOrZero(
        ev.updates?.[0].experiencePoints?.newPoints?.amount,
      );
      const xpOldTotal = toNumberOrZero(
        ev.updates?.[0].experiencePoints?.oldPoints?.amount,
      );

      return {
        newTotal: xpNewTotal,
        received: xpNewTotal - xpOldTotal,
        receivedExcludingBonuses: xpNewTotal - xpOldTotal - bonusTotal,
        dailyBoost,
        remainingDailyBoost,
        participationBonus,
        teamPlayerBonus,
      };
    },
    [fetchRemainingBoost],
  );

  const getLevelRewards = useCallback(
    async (ev: ProgressionUpdateEvent): Promise<Nullable<PostMatchLevelReward>> => {
      // Ignore non-match end messages
      if (!ev.reason?.matchEnd || (ev.updates ?? []).length === 0 || !userId) {
        return null;
      }

      try {
        // If there are level updates, find the starting level and the highest new level.
        const levelUpdates = (ev.updates ?? []).filter(
          (update) => typeof update.level !== 'undefined',
        );
        let oldLevel = Math.min(
          ...levelUpdates.map((update) => toNumberOrZero(update.level?.oldLevel?.number)),
        );
        let newLevel = Math.max(
          ...levelUpdates.map((update) => toNumberOrZero(update.level?.newLevel?.number)),
        );

        let seasonId = levelUpdates.at(0)?.level?.newLevel?.season?.seasonId;

        // If there weren't any level update, fetch the level from the server.
        if (levelUpdates.length === 0) {
          const xpUpdate = ev.updates?.find((update) => !!update.experiencePoints);
          seasonId = xpUpdate?.experiencePoints?.newPoints?.season?.seasonId;

          if (!seasonId) {
            return null;
          }

          const { data: levelData } = await fetchPlayerLevel({
            variables: {
              userId,
              seasonId,
            },
          });

          newLevel = levelData?.seasonProgression?.level ?? 0;
          oldLevel = levelData?.seasonProgression?.level ?? 0;
        }

        const { data: thresholdData } = await fetchLevelThresholds({
          variables: {
            // NOTE: This should never be undefined here, as the only way it would be
            // undefined originally is if there is no level update. However, if there
            // is no level update, we fetch the level from the server using an XP update
            // to get the season, and if there is no season then, we early-return null.
            seasonId: seasonId ?? ``,
            startLevel: oldLevel,
            endLevel: newLevel + 1,
          },
        });

        if (
          !thresholdData?.listLevelConfigs?.levelConfigs ||
          thresholdData.listLevelConfigs.levelConfigs.length === 0
        ) {
          return null;
        }

        return {
          newLevel,
          oldLevel,
          levelThresholds: thresholdData.listLevelConfigs.levelConfigs.map(
            (levelThreshold) => levelThreshold.threshold,
          ),
        };
      } catch (err) {
        logWarn(`Failed to parse level rewards:`, err);
      }

      return null;
    },
    [fetchLevelThresholds, fetchPlayerLevel, userId],
  );

  const getWalletRewards = useCallback(
    (ev: TransactionEvent): Nullable<PostMatchWalletReward> => {
      // Ignore non-match end messages
      if (!ev.transaction?.reason?.matchEnd) {
        return null;
      }

      logInfoVerbose(`Match end wallet update received:`, ev);

      // Bonuses
      const teamPlayerBonus = getMetaDataValue(
        ReasonMetadataField.TEAM_PLAYER_BONUS_COINS,
        ev.transaction.reason,
      );
      const participationBonus = getMetaDataValue(
        ReasonMetadataField.PARTICIPATION_BONUS_COINS,
        ev.transaction.reason,
      );
      const bonusTotal = teamPlayerBonus + participationBonus;

      // Get the add transaction operation
      const matchEndTransaction = ev.transaction.operations?.find(
        (operation) => operation.type === OperationType.TYPE_ADD,
      );

      if (!matchEndTransaction) {
        return null;
      }

      const currencyType = (matchEndTransaction.currencyId ??
        WalletCurrencyId.SoftCurrency) as WalletCurrencyId;
      const amountAdded = toNumberOrZero(matchEndTransaction.currencyAmount);

      return {
        currencyType,
        received: amountAdded,
        receivedExcludingBonuses: amountAdded - bonusTotal,
        participationBonus,
        teamPlayerBonus,
      };
    },
    [],
  );

  return {
    getXpRewards,
    getLevelRewards,
    getWalletRewards,
  };
}
