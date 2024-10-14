import { CoreAssets } from '@noice-com/assets-core';
import { Icon, Tooltip } from '@noice-com/common-ui';
import { CSSProperties } from 'react';

import styles from './DailyXpBoost.module.css';

import DailyBoostVfxImage from '@assets/vfx/daily-boost-vfx.png';

export function DailyXpBoost() {
  return (
    <Tooltip
      content={
        <div className={styles.dailyBoostTooltip}>
          Your XP gains are increased by 3x for the first 1000 XP earned today.
        </div>
      }
      placement="bottom"
    >
      <button
        className={styles.dailyBoostIconWrapper}
        onClick={() => null}
      >
        <div
          className={styles.dailyBoostVfx}
          style={
            {
              '--home-daily-boost-vfx-image': `url(${DailyBoostVfxImage})`,
            } as CSSProperties
          }
        />
        <Icon
          className={styles.dailyBoostIcon}
          icon={CoreAssets.Icons.DailyBoost}
          size={24}
          title="Daily XP boost"
        />
      </button>
    </Tooltip>
  );
}
