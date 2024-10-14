import classNames from 'classnames';

import styles from './TeamMateCardPlaceholder.module.css';

import { usePlayerBoosterApply } from '@game-logic/boosters/hooks';

export function TeamMateCardPlaceholder() {
  const { applyModeActive } = usePlayerBoosterApply();

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.applyModeActive]: applyModeActive,
      })}
    >
      <div className={styles.content}>
        <div className={styles.label}>No Card</div>
      </div>
    </div>
  );
}
