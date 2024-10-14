import { CoreAssets } from '@noice-com/assets-core';
import { WithChildren, Button, Icon } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useState } from 'react';

import { WidgetOfflineProps } from '../types';

import styles from './OfflineWidget.module.css';

import { ActiveAnimation } from '@common/status';

export function OfflineWidget({
  children,
  description,
  icon,
  loading,
  title,
}: WithChildren<WidgetOfflineProps>) {
  const [showText, setShowText] = useState(true);

  return (
    <div className={styles.wrapper}>
      {!!children && (
        <div className={classNames(styles.contained, { [styles.dimmed]: showText })}>
          {children}
        </div>
      )}

      {showText && (
        <span className={styles.texts}>
          <span className={styles.title}>
            {icon && (
              <Icon
                className={styles.icon}
                icon={icon}
              />
            )}
            {loading && <ActiveAnimation />}
            <span className={styles.titleText}>{title}</span>
          </span>

          {!!description && <span className={styles.description}>{description}</span>}

          {!!children && (
            <div className={styles.closeButton}>
              <Button
                iconStart={CoreAssets.Icons.Clear}
                size="sm"
                onClick={() => setShowText(false)}
              >
                Close box
              </Button>
            </div>
          )}
        </span>
      )}
    </div>
  );
}
