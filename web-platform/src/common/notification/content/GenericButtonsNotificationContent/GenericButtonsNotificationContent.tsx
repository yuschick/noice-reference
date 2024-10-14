import { Button, Icon } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './GenericButtonsNotificationContent.module.css';

import { NotificationComponentBaseProps } from '@common/notification/types';

interface Props extends NotificationComponentBaseProps {
  description: string;
  acceptButton: {
    content: string;
    onClick: (notificationId: string) => void;
  };
  declineButton?: {
    content: string;
    onClick: (notificationId: string) => void;
  };
}

export function GenericButtonsNotificationContent({
  theme = 'light',
  notificationId,
  description,
  icon,
  subtext,
  acceptButton,
  declineButton,
}: Props) {
  return (
    <div className={classNames(styles.wrapper, styles[theme])}>
      {icon && (
        <Icon
          className={styles.icon}
          icon={icon}
        />
      )}

      <div className={styles.content}>
        <div className={styles.textContent}>
          <span>{description}</span>
          {!!subtext && <span className={styles.subtext}>{subtext}</span>}
        </div>

        <div className={styles.buttons}>
          <Button
            level="primary"
            size="sm"
            theme={theme === 'light' ? 'dark' : 'light'}
            onClick={() => acceptButton.onClick(notificationId)}
          >
            {acceptButton.content}
          </Button>

          {declineButton && (
            <Button
              level="secondary"
              size="sm"
              theme={theme === 'light' ? 'dark' : 'light'}
              onClick={() => declineButton.onClick(notificationId)}
            >
              {declineButton.content}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
