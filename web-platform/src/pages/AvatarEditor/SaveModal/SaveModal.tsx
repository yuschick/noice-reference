import { FullScreenModal } from '@noice-com/common-ui';
import { GenerateAvatarEventProgress } from '@noice-com/schemas/avatar/avatar.pb';
import { CSSProperties } from 'react';

import styles from './SaveModal.module.css';

interface Props {
  progress: GenerateAvatarEventProgress;
}

export function SaveModal({ progress }: Props) {
  const totalProgress =
    ((progress.stepIndex ?? 0) + (progress.progress ?? 0)) / (progress.stepCount ?? 0);
  const totalProgressPercentage = Math.round(totalProgress * 100);

  return (
    <FullScreenModal
      ariaLabel="Save avatar"
      hasTransparentBg
      isOpen
    >
      <div className={styles.wrapper}>
        <span className={styles.titleText}>Saving avatar...</span>
        <span className={styles.progressText}>{`${totalProgressPercentage}%`}</span>

        <div className={styles.progressBase}>
          <div
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={totalProgressPercentage}
            className={styles.progressFill}
            role="progressbar"
            style={
              {
                '--avatar-editor-save-modal-progress': `${totalProgress}`,
              } as CSSProperties
            }
            title={progress.stepName}
          />
        </div>
      </div>
    </FullScreenModal>
  );
}
