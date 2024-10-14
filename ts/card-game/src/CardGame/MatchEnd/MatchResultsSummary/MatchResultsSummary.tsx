import { CoreAssets } from '@noice-com/assets-core';
import { Button, IconButton, SetTimeoutId } from '@noice-com/common-ui';
import { MatchEndedMsg } from '@noice-com/schemas/game-logic/game_logic.pb';
import { Nullable } from '@noice-com/utils';
import { useEffect, useRef } from 'react';

import { MatchEndRewards } from '../types';

import { Countdown } from './Countdown/Countdown';
import styles from './MatchResultsSummary.module.css';
import { PlayerScores } from './PlayerScores/PlayerScores';
import { Results } from './Results/Results';

interface Props {
  matchEndMessage: MatchEndedMsg;
  rewards: MatchEndRewards;
  enableCountdown: boolean;
  onCloseCountdownEnd?(): void;
  onCloseClicked?(): void;
  onClickViewDetails?(): void;
}

export function MatchResultsSummary({
  matchEndMessage,
  rewards,
  enableCountdown,
  onCloseCountdownEnd,
  onClickViewDetails,
  onCloseClicked,
}: Props) {
  const timeoutRef = useRef<Nullable<SetTimeoutId>>(null);

  useEffect(() => {
    if (!enableCountdown) {
      return;
    }

    timeoutRef.current = setTimeout(() => onCloseCountdownEnd?.(), 8000);

    return () => {
      if (!timeoutRef.current) {
        return;
      }

      clearTimeout(timeoutRef.current);
    };
  }, [onCloseCountdownEnd, enableCountdown]);

  return (
    <div className={styles.matchEndCtaContainer}>
      <div className={styles.matchEndResultsContainer}>
        <PlayerScores matchEndMessage={matchEndMessage} />

        <Results
          matchEndMessage={matchEndMessage}
          rewards={rewards}
        />
      </div>

      <div className={styles.footer}>
        <Button
          fit="content"
          level="secondary"
          size="sm"
          theme="light"
          onClick={onClickViewDetails}
        >
          View more details
        </Button>

        <div className={styles.closeAndCountdownButtonContainer}>
          <Countdown
            durationSeconds={8}
            enabled={enableCountdown}
          />
          <div className={styles.countdownContainer}>
            <IconButton
              icon={CoreAssets.Icons.Close}
              label="Close summary"
              level="secondary"
              shape="circle"
              size="sm"
              onClick={onCloseClicked}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
