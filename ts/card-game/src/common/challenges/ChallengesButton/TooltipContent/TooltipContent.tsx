import classNames from 'classnames';

import { ChallengeSelectedStatus } from '../ChallengesButton';

import styles from './TooltipContent.module.css';

interface Props {
  challengeSelectedStatus: ChallengeSelectedStatus;
}

export function TooltipContent({ challengeSelectedStatus }: Props) {
  return (
    <div className={styles.container}>
      {challengeSelectedStatus === 'initial' && <span>Open Match Challenges</span>}
      {challengeSelectedStatus !== 'initial' && (
        <>
          <span className={styles.title}>Match Challenges</span>
          <span
            className={classNames(styles.status, {
              [styles.selected]: challengeSelectedStatus === 'selected',
              [styles.unselected]: challengeSelectedStatus === 'unselected',
            })}
          >
            {challengeSelectedStatus === 'selected' ? 'Selected' : 'Not Selected'}
          </span>
          <span className={styles.description}>
            {challengeSelectedStatus === 'selected'
              ? 'You can view and change your selection until the next match starts'
              : 'Select before the next match starts'}
          </span>
        </>
      )}
    </div>
  );
}
