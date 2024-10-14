import { Challenge } from './Challenge/Challenge';
import styles from './ChallengeList.module.css';

export function ChallengeList() {
  return (
    <div className={styles.universalChallengesListContainer}>
      <Challenge />
      <Challenge />
      <Challenge />
      <Challenge />
    </div>
  );
}
