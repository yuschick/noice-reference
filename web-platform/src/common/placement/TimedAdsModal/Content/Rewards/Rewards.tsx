import { Operation } from '@noice-com/schemas/wallet/wallet.pb';
import { CSSProperties } from 'react';

import styles from './Rewards.module.css';
import { RewardTransaction } from './RewardTransaction/RewardTransaction';

function getDistanceToCenter(componentWidth: number, amountRewards: number) {
  if (amountRewards === 1) {
    return 0;
  }

  if (amountRewards === 2) {
    return componentWidth / 2;
  }

  if (amountRewards === 3) {
    return componentWidth;
  }

  return 0;
}

function getDistanceToCenterInTop(componentWidth: number, amountRewards: number) {
  const distanceToCenter = getDistanceToCenter(componentWidth, amountRewards);

  return distanceToCenter * 0.69;
}

export interface Props {
  rewardedWalletTransactions: Operation[];
}

export function Rewards({ rewardedWalletTransactions }: Props) {
  return (
    <div
      className={styles.wrapper}
      style={
        {
          '--timed-ads-rewards-distance-to-center': getDistanceToCenter(
            320,
            rewardedWalletTransactions.length,
          ),
          '--timed-ads-rewards-distance-to-center-in-top': getDistanceToCenterInTop(
            320,
            rewardedWalletTransactions.length,
          ),
        } as CSSProperties
      }
    >
      {rewardedWalletTransactions.map((reward, index) => {
        return (
          <RewardTransaction
            index={index}
            key={`timedAdReward_${index}`}
            reward={reward}
            totalRewardAmount={rewardedWalletTransactions.length}
          />
        );
      })}
    </div>
  );
}
