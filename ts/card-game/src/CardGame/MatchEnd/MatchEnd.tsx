import { useAnalytics } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './MatchEnd.module.css';
import { MatchRewards, useMatchEnd } from './MatchEndProvider';
import { MatchResultsDialog } from './MatchResultsDialog/MatchResultsDialog';
import { MatchResultsSummary } from './MatchResultsSummary/MatchResultsSummary';
import { MatchEndRewards } from './types';

export interface MatchEndProps {
  showResultsSummary: boolean;
  onMatchEndCompleted?(): void;
}

function getSeasonProgression(rewards: Nullable<MatchRewards>) {
  if (!rewards) {
    return {
      level: 1,
      currentLevelXp: 0,
      nextLevelXp: 1,
      currentXp: 0,
      rankUp: false,
    };
  }

  const threshHolds = rewards.levelRewards.levelThresholds;
  const currentLevelThresh =
    threshHolds.length > 1 ? threshHolds[threshHolds.length - 2] : threshHolds[0];
  const nextLevelThresh = threshHolds[threshHolds.length - 1];

  return {
    level: rewards.levelRewards.newLevel ?? 1,
    currentLevelXp: currentLevelThresh,
    nextLevelXp: nextLevelThresh,
    currentXp: rewards.xpRewards.newTotal ?? 0,
    rankUp: (rewards?.levelRewards.newLevel ?? 0) > (rewards?.levelRewards.oldLevel ?? 0),
  };
}

function getBonuses(rewards: Nullable<MatchRewards>) {
  return {
    participation: !!rewards?.xpRewards.participationBonus,
    teamPlayer: !!rewards?.xpRewards.teamPlayerBonus,
  };
}

function getCurrencyRewards(rewards: Nullable<MatchRewards>) {
  return rewards
    ? [
        {
          amount: rewards?.walletRewards.received,
          currencyId: rewards?.walletRewards.currencyType,
        },
      ]
    : [];
}

export function MatchEnd({ showResultsSummary, onMatchEndCompleted }: MatchEndProps) {
  const matchEndData = useMatchEnd();
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [countdownEnabled, setCountdownEnabled] = useState<boolean>(true);
  const { trackEvent } = useAnalytics();

  const handleReset = useCallback(() => {
    setCountdownEnabled(true);
    setShowDialog(false);
  }, []);

  const handleViewDetailsClick = useCallback(() => {
    setShowDialog(true);
    setCountdownEnabled(false);

    trackEvent({
      clientMatchEndResultsSummaryDetailsClicked: {},
    });
  }, [trackEvent]);

  const handleResultsDialogClose = useCallback(() => {
    setShowDialog(false);
  }, []);

  const handleCountdownEnd = useCallback(() => {
    trackEvent({
      clientMatchEndResultsSummaryCountdownEnded: {},
    });

    onMatchEndCompleted?.();
    handleReset();
  }, [onMatchEndCompleted, trackEvent, handleReset]);

  const handleCloseClicked = useCallback(() => {
    trackEvent({
      clientMatchEndResultsSummaryCloseClicked: {},
    });

    onMatchEndCompleted?.();
    handleReset();
  }, [onMatchEndCompleted, trackEvent, handleReset]);

  const actualRewards = useMemo<Nullable<MatchEndRewards>>(() => {
    if (!matchEndData) {
      return null;
    }

    const { rewards } = matchEndData;

    return {
      currency: getCurrencyRewards(rewards),
      seasonProgresion: getSeasonProgression(rewards),
      bonuses: getBonuses(rewards),
    };
  }, [matchEndData]);

  useEffect(() => {
    if (matchEndData) {
      return;
    }

    handleReset();
  }, [matchEndData, handleReset]);

  if (!matchEndData || !actualRewards) {
    return null;
  }

  const { rawResults } = matchEndData;

  if (!rawResults) {
    return null;
  }

  return (
    <>
      {showResultsSummary && (
        <div className={styles.matchEndContentContainer}>
          <MatchResultsSummary
            enableCountdown={countdownEnabled}
            matchEndMessage={rawResults}
            rewards={actualRewards}
            onClickViewDetails={handleViewDetailsClick}
            onCloseClicked={handleCloseClicked}
            onCloseCountdownEnd={handleCountdownEnd}
          />
        </div>
      )}

      {showDialog && (
        <div className={styles.matchEndDialogWrapper}>
          <MatchResultsDialog
            matchEndMessage={rawResults}
            rewards={actualRewards}
            onClose={handleResultsDialogClose}
          />
        </div>
      )}
    </>
  );
}
