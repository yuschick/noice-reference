import { CoreAssets } from '@noice-com/assets-core';
import { Button, Icon } from '@noice-com/common-ui';

import styles from './AvatarSavingErrorNotificationContent.module.css';

import { NotificationComponentBaseProps } from '@common/notification/types';

interface Props extends NotificationComponentBaseProps {
  onRetry(notificationId: string): void;
}

export function AvatarSavingErrorNotificationContent({ notificationId, onRetry }: Props) {
  return (
    <div className={styles.wrapper}>
      <Icon
        className={styles.icon}
        icon={CoreAssets.Icons.Error}
      />

      <div className={styles.content}>
        <div className={styles.textContent}>
          <span>Avatar save failed</span>

          <span className={styles.subtext}>
            <span>Something went wrong with saving your avatar</span>
          </span>

          <Button
            level="primary"
            size="xs"
            theme="dark"
            title="Try again"
            onClick={() => onRetry(notificationId)}
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
