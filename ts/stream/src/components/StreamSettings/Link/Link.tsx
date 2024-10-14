import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './Link.module.css';

export interface Props {
  value: string;
  label: string;
  onClick(): void;
}

export function Link({ value, label, onClick }: Props) {
  return (
    <button
      className={classNames(styles.itemWrapper)}
      onClick={onClick}
    >
      <span className={styles.mainLevelLabel}>{label}</span>
      <span className={styles.mainLevelValueLabel}>{value}</span>
      <Icon
        className={classNames(styles.chevron, styles.chevronRight)}
        icon={CoreAssets.Icons.ChevronRight}
      />
    </button>
  );
}
