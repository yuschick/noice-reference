import { MatchGroupWaitingSmProps } from '../types';

import styles from './MatchGroupWaitingSm.module.css';

import { ChallengesButton } from '@game-common/challenges';
import { CardRowTeamInfoSm } from '@game-common/team';
import { useCardGameUIState } from '@game-context';

export function MatchGroupWaitingSm({ slots }: MatchGroupWaitingSmProps) {
  const { isChallengesDialogOpen } = useCardGameUIState();

  if (isChallengesDialogOpen) {
    return null;
  }

  return (
    <div className={styles.matchGroupWaitingRoot}>
      <ChallengesButton showSelectedIcon />

      <CardRowTeamInfoSm className={styles.matchGroupWaitingTeamInfo} />

      {slots?.cardContainerSmAction ? slots.cardContainerSmAction : null}
    </div>
  );
}
