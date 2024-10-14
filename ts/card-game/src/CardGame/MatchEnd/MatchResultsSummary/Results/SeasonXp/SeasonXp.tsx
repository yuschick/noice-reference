import { CoreAssets } from '@noice-com/assets-core';
import { HorizontalProgressBar, SeasonRankBadge } from '@noice-com/common-ui';

import styles from './SeasonXp.module.css';

interface Props {
  level: number;
  progress: number;
  rankUp: boolean;
}

export function SeasonXp({ level, progress, rankUp }: Props) {
  const description = rankUp ? 'Rank up' : 'Season Rank';

  return (
    <div className={styles.matchEndSeasonXpContainer}>
      <SeasonRankBadge
        rank={level}
        size="md"
      />
      <div className={styles.rank}>
        <div className={styles.rankDescription}>
          <div className={styles.descriptionText}>{description}</div>
          {rankUp && (
            <div className={styles.iconWrapper}>
              <CoreAssets.Icons.ArrowUp />
            </div>
          )}
        </div>
        <HorizontalProgressBar
          className={styles.progressbar}
          max={1}
          min={0}
          progress={progress}
          title="plop"
        />
      </div>
    </div>
  );
}
