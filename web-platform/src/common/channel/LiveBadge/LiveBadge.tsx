import styles from './LiveBadge.module.css';

export function LiveBadge() {
  return (
    <div className={styles.liveBadgeWrapper}>
      <span className={styles.liveBadgeText}>Live</span>
    </div>
  );
}
