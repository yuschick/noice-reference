import { CoreAssets } from '@noice-com/assets-core';
import { Countdown, Icon } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';

import styles from './ChatMuteNotification.module.css';

interface Props {
  muteStartTime: Nullable<Date>;
  onMuteCompleted(): void;
}

export function ChatMuteNotification({ muteStartTime, onMuteCompleted }: Props) {
  if (!muteStartTime) {
    return null;
  }

  return (
    <div className={styles.muteNotification}>
      <div className={styles.body}>
        <Icon
          className={styles.muteIcon}
          icon={CoreAssets.Icons.Muted}
        />

        <div className={styles.muteMessageWrapper}>
          <div className={styles.message}>You have been muted by a moderator.</div>
          <div className={styles.info}>
            You can chat again in{' '}
            <Countdown
              className={styles.countdownTimer}
              secondsSuffix="s"
              target={muteStartTime}
              onCompleted={onMuteCompleted}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
