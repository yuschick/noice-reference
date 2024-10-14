import { NumberUtils } from '@noice-com/utils';

import styles from './RoundEndedBottomBarContent.module.css';

import { AnimatedLabel } from '@game-common/game';
import { useLeaderboardGroupRank } from '@game-common/leaderboard/hooks';
import { useStreamGame } from '@game-logic/game/context';

export function RoundEndedBottomBarContent() {
  const { groupRank: leaderboardPosition } = useLeaderboardGroupRank();
  const { isSolo } = useStreamGame();

  return (
    <div>
      <div className={styles.roundEndedLabelContainer}>
        <AnimatedLabel
          className={styles.roundEndedLabel}
          text="Round Over"
        />
        {!isSolo && (
          <p
            className={styles.roundEndedLeaderboardPlacings}
            key="team-score"
          >
            Your team is in&nbsp;
            <span className={styles.roundEndedHighlight}>
              {NumberUtils.getNumberWithOrdinal(leaderboardPosition)} place
            </span>
          </p>
        )}
      </div>
      <div className={styles.roundEndedText}>Waiting for next round to start...</div>
    </div>
  );
}
