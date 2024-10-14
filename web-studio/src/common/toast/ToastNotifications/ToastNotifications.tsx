import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import classNames from 'classnames';
import { Toaster } from 'react-hot-toast';

import styles from './ToastNotifications.module.css';

export function ToastNotifications() {
  return (
    <Toaster
      toastOptions={{
        position: 'bottom-center',
        success: {
          className: classNames(styles.toast, styles.toastSuccess),
          icon: (
            <Icon
              className={styles.icon}
              icon={CoreAssets.Icons.CheckStudio}
            />
          ),
        },
        error: {
          className: classNames(styles.toast, styles.toastError),
          icon: (
            <Icon
              className={styles.icon}
              icon={CoreAssets.Icons.Alert}
              size={24}
            />
          ),
        },
      }}
    />
  );
}
