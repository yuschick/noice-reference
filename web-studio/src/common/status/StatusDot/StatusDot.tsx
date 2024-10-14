import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import classNames from 'classnames';

import { ActiveAnimation } from '../ActiveAnimation';
import { Status } from '../types';

import styles from './StatusDot.module.css';

interface StatusDotProps {
  className?: string;
  status: Status;
}

const getStatusIcon = (status: Status) => {
  switch (status) {
    case Status.Loading:
      return <ActiveAnimation type="loading" />;
    case Status.Active:
      return <ActiveAnimation type="active" />;
    case Status.Paused:
      return (
        <Icon
          className={styles.pause}
          icon={CoreAssets.Icons.Pause}
        />
      );
    default:
      return <span className={styles.bullet}>●</span>;
  }
};

export function StatusDot({ className, status }: StatusDotProps) {
  return (
    <span className={classNames(styles.statusIcon, styles[status], className)}>
      {getStatusIcon(status)}
    </span>
  );
}
