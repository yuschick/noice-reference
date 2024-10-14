import { Button, ButtonLink, Icon } from '@noice-com/common-ui';
import classNames from 'classnames';
import { To } from 'react-router';

import styles from './GenericLinkButtonNotificationContent.module.css';

import { NotificationComponentBaseProps } from '@common/notification/types';

interface Props extends NotificationComponentBaseProps {
  description: string;
  buttonLink: {
    content: string;
    to: To;
    onClick?(notificationId: string): void;
  };
  dismissButton?: {
    content: string;
    onClick(notificationId: string): void;
  };
}

export function GenericLinkButtonNotificationContent({
  theme = 'light',
  notificationId,
  description,
  icon,
  subtext,
  buttonLink,
  dismissButton,
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
          <ButtonLink
            size="sm"
            theme={theme === 'light' ? 'dark' : 'light'}
            to={buttonLink.to}
            onClick={() => buttonLink.onClick?.(notificationId)}
          >
            {buttonLink.content}
          </ButtonLink>
          {dismissButton && (
            <Button
              level="secondary"
              size="sm"
              theme={theme === 'light' ? 'dark' : 'light'}
              onClick={() => dismissButton.onClick(notificationId)}
            >
              {dismissButton.content}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
