import { gql } from '@apollo/client';
import { useKeyboardNavigation } from '@noice-com/common-ui';
import { useEffect, useRef, useState } from 'react';

import { RewardButton } from './RewardButton/RewardButton';
import styles from './RewardRow.module.css';

import { TimedAdsRewardRowRewardFragment } from '@gen';

interface Props {
  rewards: TimedAdsRewardRowRewardFragment[];
}

function getCountdownIndex(rewards: TimedAdsRewardRowRewardFragment[]) {
  return rewards.findIndex((reward) => {
    const readyAt = new Date(reward.readyAt);

    return readyAt.getTime() > Date.now();
  });
}

export function RewardRow({ rewards }: Props) {
  const [countdownIndex, setCountdownIndex] = useState<number>(
    getCountdownIndex(rewards),
  );
  const rewardsWrapperRef = useRef<HTMLDivElement>(null);
  const rewardItemRefs = useRef<HTMLButtonElement[]>([]);

  useEffect(() => {
    if (countdownIndex === -1) {
      return;
    }

    const timeoutMs =
      new Date(rewards[countdownIndex].readyAt).getTime() - Date.now() + 10;
    const timeout = setTimeout(() => {
      setCountdownIndex(getCountdownIndex(rewards));
    }, timeoutMs);

    return () => clearTimeout(timeout);
  }, [countdownIndex, rewards]);

  useEffect(() => {
    setCountdownIndex(getCountdownIndex(rewards));
  }, [rewards]);

  useKeyboardNavigation({
    container: rewardsWrapperRef,
    items: rewardItemRefs,
  });

  return (
    <div
      className={styles.wrapper}
      ref={rewardsWrapperRef}
    >
      <section
        aria-label="Ad Rewards"
        className={styles.rewardsWrapper}
      >
        {rewards.map((reward, index) => {
          const readyAt = new Date(reward.readyAt);
          const locked = readyAt.getTime() > Date.now();
          const ftueAnchor = index === 0 ? 'adCurrentChest' : undefined;

          return (
            <RewardButton
              data-ftue-anchor={ftueAnchor}
              key={`rewardButton_${index}`}
              locked={locked}
              rarity={reward.rarity}
              readyAt={readyAt.getTime()}
              reward={reward}
              rewardItemRefs={rewardItemRefs}
              selected={index === 0}
              showCountdown={index === countdownIndex}
            />
          );
        })}
      </section>
    </div>
  );
}

RewardRow.fragments = {
  entry: gql`
    fragment TimedAdsRewardRowReward on AdsRewardDescription {
      rarity
      readyAt
      prizes {
        min
        max
        ...TimedAdsLegendPrize
      }
    }
  `,
};
