import styles from './VoteCounts.module.css';

export function VoteCounts() {
  return (
    <div className={styles.voteCountsContainer}>
      <span className={styles.votePercentageText}>25%</span>
      <span className={styles.voteCountText}>250</span>
    </div>
  );
}
