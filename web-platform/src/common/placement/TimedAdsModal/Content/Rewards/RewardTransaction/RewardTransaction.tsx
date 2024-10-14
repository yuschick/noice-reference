import { Image } from '@noice-com/common-ui';
import { Operation } from '@noice-com/schemas/wallet/wallet.pb';
import classNames from 'classnames';

import { getCurrencyIcon } from '../../../utils';

import { Background } from './Background/Background';
import styles from './RewardTransaction.module.css';

interface Props {
  reward: Operation;
  totalRewardAmount: number;
  index: number;
}

export function RewardTransaction({ reward, totalRewardAmount, index }: Props) {
  const iconSrc = getCurrencyIcon(reward.currencyId);
  if (!iconSrc) {
    return null;
  }

  let color: 'yellow' | 'green' | 'red' = 'yellow';
  if (reward.currencyId === 'hard-currency') {
    color = 'red';
  } else if (reward.currencyId === 'reshuffle-token') {
    color = 'green';
  }

  const isLeft = index === 0 && totalRewardAmount > 1;
  const isCenter = (index === 1 && totalRewardAmount === 3) || totalRewardAmount === 1;
  const isRight = index === totalRewardAmount - 1 && totalRewardAmount > 1;

  return (
    <div
      className={classNames(styles.rewardContainer, {
        [styles.rewardLeft]: isLeft,
        [styles.rewardCenter]: isCenter,
        [styles.rewardRight]: isRight,
      })}
      key={`timedAdReward_${index}`}
    >
      <div
        className={classNames(styles.rewardPlatform, {
          [styles.rewardLeft]: isLeft,
          [styles.rewardCenter]: isCenter,
          [styles.rewardRight]: isRight,
        })}
      >
        <Background color={color} />
      </div>
      <div
        className={classNames(styles.reward, {
          [styles.rewardLeft]: isLeft,
          [styles.rewardCenter]: isCenter,
          [styles.rewardRight]: isRight,
        })}
      >
        <Image
          alt={reward.currencyId}
          className={styles.rewardIcon}
          loadingType="none"
          src={iconSrc}
        />
        <span
          className={classNames(styles.rewardAmountText, {
            [styles.appearLeft]: isLeft,
            [styles.appearCenter]: isCenter,
            [styles.appearRight]: isRight,
          })}
        >
          {reward.currencyAmount}
        </span>
      </div>
    </div>
  );
}
