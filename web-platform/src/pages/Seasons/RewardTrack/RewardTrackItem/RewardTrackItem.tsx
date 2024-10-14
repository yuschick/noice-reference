import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { GameCard } from '@noice-com/card-game';
import {
  CurrencyIcon,
  WalletCurrencyId,
  CommonUtils,
  Icon,
  Tooltip,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';

import { CollectVfx } from './CollectVfx/CollectVfx';
import styles from './RewardTrackItem.module.css';

import {
  RewardTrackItemLevelConfigFragment,
  RewardTrackItemProgressionFragment,
  RewardTrackItemRewardsFragment,
} from '@gen';

RewardTrackItem.fragments = {
  levelConfig: gql`
    fragment RewardTrackItemLevelConfig on ProgressionLevelConfig {
      number
      threshold
      seasonId
      rewards {
        reward {
          ... on RewardRewardTypeItem {
            itemId
            item {
              type
              name
              id
              seasonId
              unlockItemId
              details {
                ...GameCard
              }
            }
          }
          ... on RewardRewardTypeCurrency {
            currencyId
            currencyAmount
          }
        }
      }
    }

    ${GameCard.fragments.card}
  `,

  progression: gql`
    fragment RewardTrackItemProgression on ProgressionSeasonProgression {
      xpAmount
      level
      nextLevelThreshold
    }
  `,

  rewards: gql`
    fragment RewardTrackItemRewards on RewardReward {
      id
      reason {
        reason {
          __typename
          ... on ReasonReasonLevelUp {
            level
            seasonId
          }
        }
      }
    }
  `,
};

interface Props {
  progression: RewardTrackItemProgressionFragment;
  level: RewardTrackItemLevelConfigFragment;
  rewards?: RewardTrackItemRewardsFragment[];
  previousThreshold: number;
  showMainReward: boolean;
  remainingDailyXpBoost: number;
}

export function RewardTrackItem({
  progression,
  level,
  rewards,
  previousThreshold,
  showMainReward,
  remainingDailyXpBoost,
}: Props) {
  const [showCollectVfx, setShowCollectVfx] = useState<boolean>(false);
  const collectVfxTimerRef = useRef<number>(-1);

  const dailyBoostTooltipAnchor = useRef<HTMLButtonElement>(null);

  const unclaimedReward = useMemo(
    () =>
      rewards?.find(
        (reward) =>
          reward.reason.reason?.__typename === 'ReasonReasonLevelUp' &&
          reward.reason.reason.level === level.number &&
          reward.reason.reason.seasonId === level.seasonId,
      ),
    [rewards, level.number, level.seasonId],
  );

  const collected = useMemo(
    () => !unclaimedReward && level.number <= progression.level,
    [unclaimedReward, level.number, progression.level],
  );

  const completed = useMemo(
    () => unclaimedReward && level.number <= progression.level,
    [unclaimedReward, level.number, progression.level],
  );
  const completedWasTrueOnPrevRender = useRef<boolean | null>(null);

  const hasDailyBoostProgress = useMemo(() => {
    // There is no boost left
    if (!remainingDailyXpBoost) {
      return false;
    }

    // Completed level, no daily xp progress
    if (level.number <= progression.level) {
      return false;
    }

    // Not enough xp daily boost left to reach this level
    if (progression.xpAmount + remainingDailyXpBoost < previousThreshold) {
      return false;
    }

    return true;
  }, [
    level.number,
    previousThreshold,
    progression.level,
    progression.xpAmount,
    remainingDailyXpBoost,
  ]);

  const fullWithDailyBoostProgress = useMemo(() => {
    if (!hasDailyBoostProgress) {
      return false;
    }

    if (progression.xpAmount + remainingDailyXpBoost >= level.threshold) {
      return true;
    }

    return false;
  }, [
    hasDailyBoostProgress,
    level.threshold,
    progression.xpAmount,
    remainingDailyXpBoost,
  ]);

  useEffect(() => {
    if (!completed) {
      return;
    }
    completedWasTrueOnPrevRender.current = completed;
  }, [completed]);

  useEffect(() => {
    if (completed || !completedWasTrueOnPrevRender.current) {
      return;
    }
    setShowCollectVfx(true);

    collectVfxTimerRef.current = window.setTimeout(() => {
      setShowCollectVfx(false);
      window.clearTimeout(collectVfxTimerRef.current);
    }, 3000);
  }, [completed]);

  const trackProgress =
    level.number === progression.level + 1
      ? `${Math.round(
          ((previousThreshold - progression.xpAmount) /
            (previousThreshold - progression.nextLevelThreshold)) *
            100,
        )}%`
      : undefined;

  const dailyBoostProgress =
    hasDailyBoostProgress && !fullWithDailyBoostProgress
      ? `${Math.round(
          ((remainingDailyXpBoost + progression.xpAmount - previousThreshold) /
            (level.threshold - previousThreshold)) *
            100,
        )}%`
      : undefined;

  return (
    <div
      className={classNames(styles.rewardItemWrapper, {
        [styles.completed]: level.number <= progression.level,
        [styles.withDailyBoost]: !!hasDailyBoostProgress || fullWithDailyBoostProgress,
        [styles.currentRank]: level.number === progression.level,
        [styles.collectVfx]: showCollectVfx,
      })}
      data-ftue-anchor={!collected && unclaimedReward ? 'unclaimedReward' : undefined}
    >
      <section className={styles.rewardRankProgressWrapper}>
        <span>
          Rank <span className={styles.rankNumber}> {level.number}</span>
        </span>

        <div
          aria-valuemax={progression.nextLevelThreshold}
          aria-valuenow={progression.xpAmount}
          className={styles.rankProgressBarWrapper}
          role="progressbar"
          style={
            {
              '--reward-track-item-progress':
                progression.level >= level.number ? '100%' : trackProgress,
              '--reward-track-daily-boost-progress': fullWithDailyBoostProgress
                ? '100%'
                : dailyBoostProgress,
            } as CSSProperties
          }
          title="Reward track progress"
        >
          {hasDailyBoostProgress && !fullWithDailyBoostProgress && (
            <Tooltip
              content={
                <div className={styles.dailyBoostTooltip}>
                  Your XP gains are increased by 3x for the first 1000 XP earned today.
                </div>
              }
              placement="top"
            >
              <button
                className={styles.dailyBoostIcon}
                ref={dailyBoostTooltipAnchor}
                type="button"
                onClick={() => false}
              >
                <Icon
                  icon={CoreAssets.Icons.DailyBoost}
                  title="Daily boost progress"
                />
              </button>
            </Tooltip>
          )}
        </div>
      </section>

      <div
        className={classNames(styles.wrapper, {
          [styles.collected]: collected,
          [styles.completed]: completed,
          [styles.fullDailyBoost]: fullWithDailyBoostProgress,
          [styles.progressCompleted]: level.number <= progression.level,
          [styles.large]: level.rewards.length > 1,
        })}
        data-ftue-anchor={!collected && unclaimedReward ? 'unclaimedReward' : undefined}
        style={
          {
            '--reward-track-item-progress': trackProgress ?? '0%',
            '--reward-track-daily-boost-progress': dailyBoostProgress,
          } as CSSProperties
        }
      >
        <div className={styles.rewards}>
          <div className={styles.rewardsContent}>
            {showMainReward &&
              level.rewards.map((reward, index) => {
                if (reward.reward?.__typename === 'RewardRewardTypeItem') {
                  if (reward.reward.item.details?.__typename === 'GameLogicCard') {
                    return (
                      <div
                        className={styles.cardWrapper}
                        key={`reward_${index}`}
                      >
                        {showCollectVfx && <CollectVfx />}
                        <GameCard card={reward.reward.item.details} />
                      </div>
                    );
                  }
                }

                if (reward.reward?.__typename === 'RewardRewardTypeCurrency') {
                  return (
                    <div
                      className={styles.rewardItem}
                      key={`reward_${index}`}
                    >
                      {showCollectVfx && <CollectVfx />}
                      <CurrencyIcon
                        size="lg"
                        type={
                          CommonUtils.getWalletCurrencyId(reward.reward.currencyId) ??
                          WalletCurrencyId.SoftCurrency
                        }
                      />
                      <span className={styles.rewardItemSubRewardText}>
                        {reward.reward.currencyAmount}
                      </span>
                    </div>
                  );
                }
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
