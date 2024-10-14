import { gql } from '@apollo/client';
import { GameCard } from '@noice-com/card-game';
import { useMemo } from 'react';

import styles from './NextUnlock.module.css';

import { NextUnlockLevelConfigFragment } from '@gen';

NextUnlock.fragments = {
  levelConfig: gql`
    fragment NextUnlockLevelConfig on ProgressionLevelConfig {
      number
      rewards {
        reward {
          ... on RewardRewardTypeItem {
            item {
              id
              details {
                ...GameCard
              }
            }
          }
        }
      }
    }

    ${GameCard.fragments.card}
  `,
};

export function NextUnlock({ number, rewards }: NextUnlockLevelConfigFragment) {
  const reward = useMemo(
    () =>
      rewards.find(
        (reward) =>
          reward.reward?.__typename === 'RewardRewardTypeItem' &&
          reward.reward.item.details?.__typename === 'GameLogicCard',
      ),
    [rewards],
  );

  return (
    <div className={styles.nextUnlockWrapper}>
      <div>
        <span>Next card unlock at</span>
        <div className={styles.unlockRankNumber}>Rank {number}</div>
      </div>

      {reward &&
        reward?.reward?.__typename === 'RewardRewardTypeItem' &&
        reward?.reward?.item.details?.__typename === 'GameLogicCard' && (
          <div className={styles.nextUnlockShadowWrapper}>
            <GameCard card={reward.reward.item.details} />
          </div>
        )}
    </div>
  );
}

NextUnlock.Loading = () => {
  return (
    <div className={styles.nextUnlockWrapper}>
      <GameCard.Loading />
    </div>
  );
};
