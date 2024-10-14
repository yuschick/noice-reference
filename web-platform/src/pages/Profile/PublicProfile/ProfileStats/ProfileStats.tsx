import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import { DateAndTimeUtils } from '@noice-com/utils';
import classNames from 'classnames';
import { useMemo } from 'react';

import styles from './ProfileStats.module.css';
import { StatsComponent } from './StatsComponent';

import { ProfileStatsFragment } from '@gen';

interface Props {
  profile: ProfileStatsFragment;
}

export function ProfileStats({ profile }: Props) {
  const statsData = useMemo(
    () => [
      {
        title: 'Matches played',
        value: profile.stats.matchesPlayed,
      },
      {
        title: 'Hours played',
        value:
          Math.round(
            (DateAndTimeUtils.parseDuration(
              profile.stats.timePlayed ? profile.stats.timePlayed : '0s',
            ) /
              1000 /
              3600) *
              10,
          ) / 10,
      },
      {
        title: 'Cards succeeded',
        value: profile.stats.cardsSucceeded,
      },
      {
        title: 'Daily goals completed',
        value: profile.stats.dailyGoalCardsCompleted,
      },
    ],
    [profile.stats],
  );

  return (
    <div className={styles.profileSectionWrapper}>
      <h3 className={styles.titleWrapper}>
        <Icon
          className={styles.icon}
          icon={CoreAssets.Icons.Leaderboard}
        />
        <span>Stats</span>
      </h3>

      <div className={styles.stats}>
        {statsData.map((data) => (
          <StatsComponent
            key={data.title}
            title={data.title}
            value={data.value}
          />
        ))}
      </div>
    </div>
  );
}

ProfileStats.Loading = () => (
  <div>
    <h2 className={styles.titleWrapper}>
      <Icon
        className={styles.icon}
        icon={CoreAssets.Icons.Leaderboard}
      />
      <span>Stats</span>
    </h2>

    <div className={classNames(styles.stats, styles.loading)}>
      {Array(4)
        .fill(null)
        .map((_, index) => (
          <StatsComponent.Loading key={index} />
        ))}
    </div>
  </div>
);

ProfileStats.fragments = {
  entry: gql`
    fragment ProfileStats on ProfileProfile {
      stats {
        matchesPlayed
        timePlayed
        cardsSucceeded
        dailyGoalCardsCompleted
      }
    }
  `,
};
