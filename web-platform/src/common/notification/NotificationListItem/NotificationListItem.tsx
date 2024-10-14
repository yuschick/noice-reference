import { CoreAssets } from '@noice-com/assets-core';
import { IconButton, WithChildren } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './NotificationListItem.module.css';

interface Props {
  theme?: 'dark' | 'light';
  isNew?: boolean;
  className?: string;
  onAnimationEnd?(): void;
  onCloseClick?(): void;
}

export function NotificationListItem({
  children,
  theme = 'light',
  isNew,
  className,
  onCloseClick,
  onAnimationEnd,
}: WithChildren<Props>) {
  return (
    <li
      className={classNames(styles.wrapper, className, styles[theme], {
        [styles.isNew]: isNew,
      })}
      onAnimationEnd={onAnimationEnd}
    >
      {children}

      {onCloseClick && (
        <IconButton
          icon={CoreAssets.Icons.Close}
          label="Close notification"
          size="sm"
          theme={theme === 'light' ? 'dark' : 'light'}
          variant="ghost"
          onClick={onCloseClick}
        />
      )}
    </li>
  );
}
