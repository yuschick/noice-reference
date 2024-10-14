import styles from './ClosedBetaWarning.module.css';

export function ClosedBetaWarning() {
  return (
    <p className={styles.closedBetaWarning}>
      During open beta, certain features may not work as expected, and you might encounter
      bugs and changes as we refine the platform.
    </p>
  );
}
