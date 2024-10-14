import classNames from 'classnames';

import styles from './ProgressBarLabel.module.css';

export interface Props {
  max: number;
  progress: number;
  start: number;
  previewUpgradedStats?: boolean;
}

export function ProgressBarLabel({ max, start, progress, previewUpgradedStats }: Props) {
  const showNewValue = !previewUpgradedStats && start !== progress;

  return (
    <div
      aria-hidden="true"
      className={styles.progressBarLabel}
    >
      <div className={styles.valueWrapper}>
        <div
          className={classNames(styles.oldValue, {
            [styles.hide]: showNewValue,
          })}
        >
          {start}
        </div>
        {showNewValue && <div className={styles.newValue}>{progress}</div>}
      </div>
      <div>
        /{max}
        {previewUpgradedStats && <span className={styles.diff}>+{progress - start}</span>}
      </div>
    </div>
  );
}
