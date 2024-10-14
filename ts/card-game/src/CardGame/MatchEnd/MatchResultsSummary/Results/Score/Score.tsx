import styles from './Score.module.css';

interface Props {
  score: number;
  description: string;
}

export function Score({ score, description }: Props) {
  return (
    <div className={styles.matchResultsSummaryPlayerScoreContainer}>
      <div className={styles.descriptionText}>{description}</div>
      <div className={styles.scoreText}>{score}</div>
    </div>
  );
}
