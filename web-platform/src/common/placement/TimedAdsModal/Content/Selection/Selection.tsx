import { gql } from '@apollo/client';
import { convertRarityRarityToRarity } from '@noice-com/card-game';
import { Button, Callout, Icon, useAnalytics } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { useTimer } from 'react-timer-hook';

import { RewardBox } from '../../RewardBox/RewardBox';

import { Legend } from './Legend/Legend';
import { RewardRow } from './RewardRow/RewardRow';
import styles from './Selection.module.css';
import { useGoogleH5Ads } from './useGoogleH5Ads.hook';

import Lock from '@assets/images/timed-ads-locked.svg';
import { CookiesSettingsButton } from '@common/cookies';
import { TIMED_REWARDS_PLACEMENT_ID } from '@common/placement/constants';
import { convertRewardsForAnalytics } from '@common/placement/TimedAdsModal/utils';
import { RarityRarity, TimedAdsSelectionRewardsFragment } from '@gen';

interface Props {
  rewards: TimedAdsSelectionRewardsFragment[];
  isAdReady?: boolean;
  isAdLoading?: boolean;

  giveReward(isAdWatched: boolean): void;
  onStartWatchingAd(): void;
}

function getLabelForRarity(rarity: RarityRarity) {
  switch (rarity) {
    case RarityRarity.RarityCommon:
      return 'Common';
    case RarityRarity.RarityUncommon:
      return 'Uncommon';
    case RarityRarity.RarityRare:
      return 'Rare';
    case RarityRarity.RarityEpic:
      return 'Epic';
    case RarityRarity.RarityLegendary:
      return 'Legendary';
  }
}

export function Selection({ rewards, giveReward, onStartWatchingAd }: Props) {
  const { trackEvent } = useAnalytics();
  const hasRequestedAd = useRef(false);

  const reward = rewards[0];
  const firstReward = rewards[0];
  const isSelectedRewardReady = new Date(reward.readyAt).getTime() < Date.now();
  const isFirstRewardReady = new Date(firstReward.readyAt).getTime() < Date.now();

  const { requestAd, showAdFn, loading, adsBlocked } = useGoogleH5Ads();

  const canWatch = !loading && isFirstRewardReady;

  useEffect(() => {
    // due to react strict mode the component is mounted twice, but we must not call requestAd() more than once
    if (!hasRequestedAd.current && isFirstRewardReady) {
      requestAd();

      hasRequestedAd.current = true;
      return;
    }

    if (!isFirstRewardReady) {
      // allow requesting ad in the future once reward box is unlocked
      hasRequestedAd.current = false;
    }
  }, [isFirstRewardReady, requestAd]);

  const { minutes, seconds } = useTimer({
    expiryTimestamp: new Date(reward.readyAt ?? Date.now()),
  });

  const buttonText = canWatch
    ? 'Watch ad to claim reward'
    : isSelectedRewardReady
    ? 'Claim previous reward first'
    : `Reward unlocks in ${minutes}:${seconds.toString().padStart(2, '0')}`;

  const onClick = showAdFn
    ? () => {
        trackEvent({
          clientTimedAdsWatchingAd: {
            pathname: window.location.pathname,
            placementId: TIMED_REWARDS_PLACEMENT_ID,
            rarity: convertRarityRarityToRarity(reward.rarity),
            possibleRewards: convertRewardsForAnalytics(reward),
          },
        });

        showAdFn();
        onStartWatchingAd();
      }
    : () => {
        giveReward(false);
      };

  return (
    <>
      <RewardRow rewards={rewards} />
      <span
        className={classNames(styles.rarityText, {
          [styles.common]: reward.rarity === RarityRarity.RarityCommon,
          [styles.uncommon]: reward.rarity === RarityRarity.RarityUncommon,
          [styles.rare]: reward.rarity === RarityRarity.RarityRare,
          [styles.epic]: reward.rarity === RarityRarity.RarityEpic,
          [styles.legendary]: reward.rarity === RarityRarity.RarityLegendary,
        })}
      >
        {`${getLabelForRarity(reward.rarity)} reward`}
      </span>
      <div className={styles.reward}>
        <Legend prizes={reward.prizes} />
        <div className={styles.rewardContent}>
          <div className={styles.rewardBoxClipping}>
            <div className={styles.rewardBoxWrapper}>
              <RewardBox
                hideStreaks={!canWatch}
                open={false}
                rarity={reward.rarity}
              />
            </div>
            {!isSelectedRewardReady && (
              <Icon
                className={styles.lockIcon}
                icon={Lock}
                title="reward is locked"
              />
            )}
          </div>
        </div>
      </div>

      {adsBlocked && (
        <div className={styles.adBlockedError}>
          <Callout
            message="Something went wrong with loading ads. Revise your cookie settings or disable ad blocker if you are using one and please try again."
            slots={{
              actions: {
                primary: <CookiesSettingsButton label="Edit cookie settings" />,
              },
            }}
            type="error"
          />
        </div>
      )}

      <div className={styles.buttonWrapper}>
        <Button
          data-ftue-anchor="adClaimRewardButton"
          isDisabled={!canWatch && !loading}
          isLoading={loading}
          size="lg"
          variant="cta"
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </div>
    </>
  );
}

Selection.fragments = {
  entry: gql`
    fragment TimedAdsSelectionRewards on AdsRewardDescription {
      rarity
      readyAt
      prizes {
        min
        max
        ...TimedAdsLegendPrize
      }

      ...TimedAdsRewardRowReward
    }

    ${RewardRow.fragments.entry}
    ${Legend.fragments.entry}
  `,
};
