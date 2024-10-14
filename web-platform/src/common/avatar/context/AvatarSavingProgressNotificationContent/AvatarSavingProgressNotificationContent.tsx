import { CoreAssets } from '@noice-com/assets-core';
import { HorizontalProgressBar, Icon } from '@noice-com/common-ui';

import styles from './AvatarSavingProgressNotificationContent.module.css';

import { NotificationComponentBaseProps } from '@common/notification/types';

export interface AvatarSavingProgressNotificationProps
  extends NotificationComponentBaseProps {
  progress: number;
}

export function AvatarSavingProgressNotificationContent({
  progress,
}: AvatarSavingProgressNotificationProps) {
  return (
    <div className={styles.wrapper}>
      <Icon
        className={styles.icon}
        icon={CoreAssets.Icons.BodyType}
      />

      <div className={styles.content}>
        <div className={styles.textContent}>
          <span>Saving your avatar</span>

          <span className={styles.progress}>{`${progress}%`}</span>

          <HorizontalProgressBar
            className={styles.progressBar}
            max={100}
            progress={progress}
            title="Avatar save progress"
          />
        </div>
      </div>
    </div>
  );
}
