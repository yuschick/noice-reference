import classNames from 'classnames';

import styles from './MatchWaiting.module.css';

import { useCardGameUIState } from '@game-context';

export function MatchWaiting() {
  const { isChallengesDialogOpen } = useCardGameUIState();

  if (isChallengesDialogOpen) {
    return null;
  }

  return (
    <div className={classNames(styles.matchWaitingRoot)}>
      <div className={styles.matchWaitingLabel}>Waiting for match...</div>
    </div>
  );
}
