import { Icon } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './GenericNotificationContent.module.css';

import { NotificationComponentBaseProps } from '@common/notification/types';

interface Props extends NotificationComponentBaseProps {
  description: string;
}

export function GenericNotificationContent({
  description,
  icon,
  subtext,
  theme = 'light',
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
      </div>
    </div>
  );
}
