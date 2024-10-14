import { CurrencyIcon, NumberCounter } from '@noice-com/common-ui';

import { MatchEndCurrencyRewardsList } from '../../../types';

import styles from './CurrencyRewards.module.css';

interface Props {
  rewards: MatchEndCurrencyRewardsList;
}

export function CurrencyRewards({ rewards }: Props) {
  return (
    <div className={styles.matchResultsSummaryCurrencyRewardsContainer}>
      {rewards.map((reward, index) => {
        return (
          <div
            className={styles.reward}
            key={`currencyReward_${index}`}
          >
            <CurrencyIcon
              size="sm"
              type={reward.currencyId}
            />

            <NumberCounter
              className={styles.rewardText}
              duration={2000}
              initialValue={0}
              prefix="+"
              targetValue={reward.amount}
            />
          </div>
        );
      })}
    </div>
  );
}
