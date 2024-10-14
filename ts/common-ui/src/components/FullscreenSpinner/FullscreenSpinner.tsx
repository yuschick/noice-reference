import { LoadingSpinner } from '../LoadingSpinner';

import styles from './FullscreenSpinner.module.css';

export function FullscreenSpinner() {
  return (
    <div className={styles.loadingWrapper}>
      <LoadingSpinner />
    </div>
  );
}
