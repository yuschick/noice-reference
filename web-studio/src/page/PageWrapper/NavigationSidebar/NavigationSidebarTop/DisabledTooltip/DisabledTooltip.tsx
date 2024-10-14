import { Icon } from '@noice-com/common-ui';
import { FaLock } from 'react-icons/fa';

import styles from './DisabledTooltip.module.css';

export interface DisabledTooltipProps {
  className?: string;
  title: string;
  content: string;
}

export function DisabledTooltip({ className, title, content }: DisabledTooltipProps) {
  return (
    <div className={className}>
      <div className={styles.wrapper}>
        <span className={styles.tooltipTitle}>{title}</span>
        <div className={styles.contentWrapper}>
          <span className={styles.labelTitle}>{content}</span>
          <Icon
            className={styles.lockIcon}
            icon={FaLock}
          />
        </div>
      </div>
    </div>
  );
}
