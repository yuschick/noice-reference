import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { parseDescription } from '@noice-com/card-game';
import { CommonUtils, Icon } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useContext } from 'react';

import { ActivityFeedSettingsContext } from '../../ActivityFeedSettingsProvider';
import { ActivityItemData } from '../../types';
import styles from '../ActivityListItem/ActivityListItem.module.css';
import { EventTimestamp } from '../EventTimestamp/EventTimestamp';
import { EventUserBadges } from '../EventUserBadges/EventUserBadges';

gql`
  fragment MatchResultsBestPlay on StreamerMatchEnded {
    bestCard {
      succeedingCard {
        cardId
        points

        card {
          id
          name
          description
          targetValue
          timerDuration
          ...GameStateCardTargetValues
        }

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
  }
`;

export function MatchResultsBestPlay({ data }: ActivityItemData) {
  const context = useContext(ActivityFeedSettingsContext);

  if (data?.content?.__typename !== 'StreamerMatchEnded' || !context) {
    return null;
  }

  const {
    content: { bestCard },
  } = data;

  if (!bestCard) {
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

      <span className={styles.eventType}>Match results - Best play</span>

      <EventTimestamp timestamp={data.timestamp} />

      <div className={styles.eventDescription}>
        <EventUserBadges badges={bestCard.succeedingCard.user.badges} />
        <span className={styles.eventUsername}>
          <span
            style={{
              color: CommonUtils.getUserIdColor({
                preferredColor: bestCard.succeedingCard.user.preferredColor,
                userId: bestCard.succeedingCard.user.userId,
              }),
            }}
          >
            {bestCard.succeedingCard.user.userTag}
          </span>
        </span>
        <span className={classNames(styles.eventDescriptionSecondary, styles.bestPlay)}>
          <span className={styles.cardName}>{bestCard.succeedingCard.card.name}</span> -{' '}
          {parseDescription(bestCard.succeedingCard.card)}
        </span>
      </div>

      <div className={styles.eventUserAvatarsWrapper}>
        <span className={styles.pointsMain}>{bestCard.succeedingCard.points}</span>
      </div>
    </>
  );
}
