import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { parseDescription } from '@noice-com/card-game';
import { CommonUtils, Icon, ProfileImage } from '@noice-com/common-ui';
import { useContext } from 'react';

import { ActivityFeedSettingsContext } from '../ActivityFeedSettingsProvider';
import { ActivityItemData } from '../types';

import styles from './ActivityListItem/ActivityListItem.module.css';
import { EventTimestamp } from './EventTimestamp/EventTimestamp';
import { EventUserBadges } from './EventUserBadges/EventUserBadges';

gql`
  fragment StreamActivityFeedHighScoringCard on GameLogicHighScoringCardPromotedMsg {
    card {
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
    }
    user {
      avatars {
        avatar2D
      }
      badges(channel_id: $channelId) {
        ...UserBadge
      }
      preferredColor
      userId
      userTag
    }
    userId
  }
`;

export function HighScoringCard({ data }: ActivityItemData) {
  const context = useContext(ActivityFeedSettingsContext);

  if (data?.content?.__typename !== 'GameLogicHighScoringCardPromotedMsg' || !context) {
    return null;
  }

  const { showAvatars } = context;
  const { content } = data;

  return (
    <>
      <Icon
        className={styles.eventIcon}
        color="text-light"
        icon={CoreAssets.Icons.Card}
        size={16}
      />

      <span className={styles.eventType}>High scoring card</span>

      <EventTimestamp timestamp={data.timestamp} />

      <div className={styles.eventDescription}>
        <EventUserBadges badges={content.user.badges} />
        <span className={styles.eventUsername}>
          <span
            style={{
              color: CommonUtils.getUserIdColor({
                preferredColor: content.user.preferredColor,
                userId: content.user.userId,
              }),
            }}
          >
            {content.user.userTag}
          </span>
        </span>{' '}
        {content.card.points} points
        <span className={styles.eventDescriptionSecondary}>
          {content.card.card.name} - {parseDescription(content.card.card)}
        </span>
      </div>

      {showAvatars && (
        <div className={styles.eventUserAvatarsWrapper}>
          {content.user && (
            <div className={styles.eventUserAvatar}>
              <ProfileImage
                profile={content.user}
                size="xs"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
