import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { CommonUtils, Icon } from '@noice-com/common-ui';
import { useContext } from 'react';

import { ActivityFeedSettingsContext } from '../../ActivityFeedSettingsProvider';
import { ActivityItemData } from '../../types';
import styles from '../ActivityListItem/ActivityListItem.module.css';
import { EventTimestamp } from '../EventTimestamp/EventTimestamp';
import { EventUserBadges } from '../EventUserBadges/EventUserBadges';

gql`
  fragment MatchResultsBestPlayer on StreamerMatchEnded {
    bestPlayer {
      id
      points
      user {
        userTag
        userId
        preferredColor
        badges {
          ...UserBadge
        }
      }
    }
  }
`;

export function MatchResultsBestPlayer({ data }: ActivityItemData) {
  const context = useContext(ActivityFeedSettingsContext);

  if (data?.content?.__typename !== 'StreamerMatchEnded' || !context) {
    return null;
  }

  const {
    content: { bestPlayer },
  } = data;

  if (!bestPlayer) {
    return null;
  }

  return (
    <>
      <Icon
        className={styles.eventIcon}
        color="status-alert-main"
        icon={CoreAssets.Icons.Crown}
        size={16}
      />

      <span className={styles.eventType}>Match results - Best player</span>

      <EventTimestamp timestamp={data.timestamp} />

      <div className={styles.eventDescription}>
        <EventUserBadges badges={bestPlayer.user.badges} />
        <span className={styles.eventUsername}>
          <span
            style={{
              color: CommonUtils.getUserIdColor({
                preferredColor: bestPlayer.user.preferredColor,
                userId: bestPlayer.user.userId,
              }),
            }}
          >
            {bestPlayer.user.userTag}
          </span>
        </span>
      </div>

      <div className={styles.eventUserAvatarsWrapper}>
        <span className={styles.pointsMain}>{bestPlayer.points}</span>
      </div>
    </>
  );
}
