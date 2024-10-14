import { Countdown, Icon, SvgComponent } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';

import styles from './PartyLeaderChangedStreamNotification.module.css';

import { NotificationComponentBaseProps } from '@common/notification/types';

export interface PartyLeaderChangedStreamNotificationProps
  extends NotificationComponentBaseProps {
  icon: SvgComponent;
  leaderName: string;
  channelName: Nullable<string>;
  countdownEndTime: Date;
  onCountdownEnd(): void;
}

export function PartyLeaderChangedStreamNotification({
  icon,
  channelName,
  leaderName,
  countdownEndTime,
  theme = 'light',
  onCountdownEnd,
}: PartyLeaderChangedStreamNotificationProps) {
  const description = channelName
    ? `${leaderName} has joined ${channelName} channel`
    : `${leaderName} has left the channel`;

  const subtext = `${channelName ? 'Joining' : 'Leaving'} the channel in `;

  return (
    <div className={classNames(styles.wrapper, styles[theme])}>
      <Icon
        className={styles.icon}
        icon={icon}
      />

      <div className={styles.content}>
        <div className={styles.textContent}>
          <span>{description}</span>
          <div className={styles.countdownContainer}>
            <span className={styles.subtext}>
              {subtext}
              <Countdown
                secondsSuffix=" sec"
                target={countdownEndTime}
                onCompleted={onCountdownEnd}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
