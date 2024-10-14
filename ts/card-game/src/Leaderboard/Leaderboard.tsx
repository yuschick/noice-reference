import classNames from 'classnames';

import styles from './Leaderboard.module.css';
import { LeaderboardItem, LeaderboardItemProps } from './LeaderboardItem';

type Group = LeaderboardItemProps['group'];

export interface Props {
  topGroups: Group[];
  totalGroupCount: number;
  ownGroupWithNeighbours?: Group[];
  /** @default 'collapsed' */
  variant?: 'collapsed' | 'scoreboard';
  showSoloWarning?: boolean;
}

export function Leaderboard({
  topGroups: allTopGroups,
  ownGroupWithNeighbours,
  showSoloWarning,
  variant,
  totalGroupCount,
}: Props) {
  const lastTopGroupRank = allTopGroups[allTopGroups.length - 1]?.rank ?? 0;

  // We render divider if own group with neighbours are not part of top groups
  const shouldRenderDivider =
    !!ownGroupWithNeighbours?.length &&
    ownGroupWithNeighbours[ownGroupWithNeighbours.length - 1].rank > lastTopGroupRank;

  // If we have to render divider, we need to show only 5 top groups
  const topGroups = shouldRenderDivider ? allTopGroups.slice(0, 5) : allTopGroups;

  return (
    <div className={classNames(styles.leaderboardRoot)}>
      <div className={styles.leaderboardHeader}>
        <h3 className={styles.leaderboardHeaderTitle}>Team Leaderboard</h3>
        <span>{totalGroupCount} teams</span>
      </div>

      {showSoloWarning && (
        <div className={styles.soloWarning}>
          You are currently in solo play mode and won&apos;t be visible in the stream
          leaderboard
        </div>
      )}

      <div className={styles.leaderboardContent}>
        {topGroups.map((group) => (
          <LeaderboardItem
            group={group}
            key={`${group.rank}-${group.groupId}`}
            variant={variant}
          />
        ))}
      </div>

      {shouldRenderDivider && (
        <>
          <div className={styles.leaderboardContentDivider}>
            <span className={styles.leaderboardContentDividerDot} />
            <span className={styles.leaderboardContentDividerDot} />
            <span className={styles.leaderboardContentDividerDot} />
          </div>

          <div className={styles.leaderboardContent}>
            {ownGroupWithNeighbours.map((group) => (
              <LeaderboardItem
                group={group}
                key={`${group.rank}-${group.groupId}`}
                variant={variant}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
