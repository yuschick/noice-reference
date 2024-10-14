import { gql } from '@apollo/client';
import { convertRarityRarityToRarity } from '@noice-com/card-game';
import { useConditionalOnce } from '@noice-com/common-react-core';
import { Button, useAnalytics } from '@noice-com/common-ui';
import { Operation } from '@noice-com/schemas/wallet/wallet.pb';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useRef, useState } from 'react';

import { RewardBox } from '../../RewardBox/RewardBox';
import { convertRewardsForAnalytics } from '../../utils';
import { Rewards } from '../Rewards/Rewards';

import styles from './ClaimedReward.module.css';

import { TIMED_REWARDS_PLACEMENT_ID } from '@common/placement/constants';
import { TimedAdsVideoRewardFragment } from '@gen';

interface Props {
  reward: TimedAdsVideoRewardFragment;
  hasAdBeenWatched: boolean;
  rewardedWalletTransactions: Nullable<Operation[]>;
  onCompleted(): void;
  onRewardPlacement(): void;
}

export function ClaimedReward({
  hasAdBeenWatched,
  reward,
  rewardedWalletTransactions,
  onCompleted,
}: Props) {
  const [showRewards, setShowRewards] = useState<boolean>(false);
  const lootBoxRef = useRef<HTMLDivElement>(null);
  const { trackEvent } = useAnalytics();

  useConditionalOnce(() => {
    if (!rewardedWalletTransactions) {
      return;
    }

    trackEvent({
      clientTimedAdsRewardsClaimed: {
        adWatched: hasAdBeenWatched,
        pathname: window.location.pathname,
        placementId: TIMED_REWARDS_PLACEMENT_ID,
        rarity: convertRarityRarityToRarity(reward.rarity),
        possibleRewards: convertRewardsForAnalytics(reward),
        actualRewards: rewardedWalletTransactions.map((transaction) => {
          return {
            currencyAmount: transaction.currencyAmount,
            currencyId: transaction.currencyId,
          };
        }),
      },
    });
  }, !!reward && !!rewardedWalletTransactions && !!trackEvent);

  const buttonText = 'Claim Reward';

  return (
    <>
      <div className={styles.wrapper}>
        <div
          className={styles.rewardBoxClipper}
          ref={lootBoxRef}
        >
          <div className={styles.rewardBox}>
            <RewardBox
              hideStreaks={false}
              rarity={reward.rarity}
              open
              onLidOpen={() => setShowRewards(true)}
            />
          </div>
        </div>
        {showRewards && rewardedWalletTransactions && (
          <Rewards rewardedWalletTransactions={rewardedWalletTransactions} />
        )}
      </div>

      <div className={classNames(styles.buttonWrapper, { [styles.show]: showRewards })}>
        <Button
          size="lg"
          variant="cta"
          onClick={onCompleted}
        >
          {buttonText}
        </Button>
      </div>
    </>
  );
}

ClaimedReward.fragments = {
  entry: gql`
    fragment TimedAdsVideoReward on AdsRewardDescription {
      rarity
      prizes {
        value
        min
        max
      }
    }
  `,
};
