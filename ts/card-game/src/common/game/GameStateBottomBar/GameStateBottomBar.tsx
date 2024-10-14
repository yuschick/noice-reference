import { Icon, SvgComponent } from '@noice-com/common-ui';
import { ReactNode } from 'react';

import styles from './GameStateBottomBar.module.css';

export interface Props {
  icon: SvgComponent;
  reason: string | ReactNode;
}

export function GameStateBottomBar({ icon, reason }: Props) {
  return (
    <div className={styles.gameStateBottomBarRoot}>
      <Icon
        className={styles.gameStateBottomBarIcon}
        icon={icon}
      />
      {reason}
    </div>
  );
}
