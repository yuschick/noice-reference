import { Button } from '@noice-com/common-ui';

import { useGuideToMetaGameCTAs } from '../hooks';

import { GuideToAds } from './components/GuideToAds/GuideToAds';
import { GuideToBuyPremiumBundles } from './components/GuideToBuyPremiumBundles/GuideToBuyPremiumBundles';
import { GuideToBuyStandardBundles } from './components/GuideToBuyStandardBundles/GuideToBuyStandardBundles';
import { GuideToCompletedDailyGoals } from './components/GuideToCompletedDailyGoals/GuideToCompletedDailyGoals';
import { GuideToDailyGoals } from './components/GuideToDailyGoals/GuideToDailyGoals';
import styles from './GuideToMetaGame.module.css';

import { AdContext, TimedAdsModal, useTimedAdsModal } from '@common/placement';

interface Props {
  onSkip: () => void;
}

export function GuideToMetaGame({ onSkip }: Props) {
  const {
    hasAvailableCTAs,
    adRewardAmount,
    hasCompletedDailyGoals,
    hasAvailableActionsInDailyGoals,
    canBuyPremiumBundles,
    canBuyStandardBundles,
  } = useGuideToMetaGameCTAs();

  const { isOpen, onOpen, onClose } = useTimedAdsModal(
    AdContext.TIMED_ADS_CONTEXT_MATCH_END,
  );

  if (!hasAvailableCTAs) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.cards}>
        {!!adRewardAmount && (
          <GuideToAds
            rewardAmount={adRewardAmount}
            onClick={onOpen}
          />
        )}
        {hasCompletedDailyGoals && <GuideToCompletedDailyGoals />}
        {!hasCompletedDailyGoals && hasAvailableActionsInDailyGoals && (
          <GuideToDailyGoals />
        )}
        {canBuyPremiumBundles && <GuideToBuyPremiumBundles />}
        {!canBuyPremiumBundles && canBuyStandardBundles && <GuideToBuyStandardBundles />}
      </div>

      <div className={styles.button}>
        <Button
          level="secondary"
          size="md"
          onClick={onSkip}
        >
          Not right now
        </Button>
      </div>
      {isOpen && <TimedAdsModal onClose={onClose} />}
    </div>
  );
}
