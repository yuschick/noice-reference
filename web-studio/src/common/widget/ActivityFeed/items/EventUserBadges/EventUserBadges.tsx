import { UserBadge } from '@noice-com/social';
import { sortBadges } from '@noice-com/social-react-core';
import { useContext } from 'react';

import { ActivityFeedSettingsContext } from '../../ActivityFeedSettingsProvider';
import styles from '../ActivityListItem/ActivityListItem.module.css';

import { UserBadgeFragment } from '@gen';

interface Props {
  badges: UserBadgeFragment[];
}

export function EventUserBadges({ badges }: Props) {
  const context = useContext(ActivityFeedSettingsContext);

  if (!context || !badges.length) {
    return null;
  }

  const { showUserBadges } = context;

  if (!showUserBadges) {
    return null;
  }

  return (
    <>
      <div className={styles.eventUserBadges}>
        {sortBadges(badges.slice(0, 2)).map((badge, index) => (
          <UserBadge
            badge={badge}
            className={styles.eventUserBadge}
            key={index}
          />
        ))}
      </div>
    </>
  );
}
