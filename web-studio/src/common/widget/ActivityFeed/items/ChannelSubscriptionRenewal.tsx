import { gql } from '@apollo/client';
import { CommonUtils, ProfileImage } from '@noice-com/common-ui';
import { UserBadge } from '@noice-com/social';
import { useContext } from 'react';

import { ActivityFeedSettingsContext } from '../ActivityFeedSettingsProvider';
import { ActivityItemData } from '../types';

import styles from './ActivityListItem/ActivityListItem.module.css';
import { EventTimestamp } from './EventTimestamp/EventTimestamp';

import { BadgeBadgeType } from '@gen';

gql`
  fragment StreamActivityFeedChannelSubscriptionRenewed on StreamerSubscriptionRenewed {
    userId
    subscriber: user {
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
  }
`;

export function ChannelSubscriptionRenewal({ data }: ActivityItemData) {
  const context = useContext(ActivityFeedSettingsContext);

  if (data?.content?.__typename !== 'StreamerSubscriptionRenewed' || !context) {
    return null;
  }

  const { showAvatars } = context;

  const { content } = data;
  const channelBadge = content.subscriber?.badges.find(
    (badge) => badge.type === BadgeBadgeType.TypeChannelSubscriber,
  );

  return (
    <>
      <UserBadge
        badge={channelBadge || { type: BadgeBadgeType.TypeChannelSubscriber, level: 2 }}
        className={styles.eventIcon}
      />

      <span className={styles.eventType}>Renewed subscription</span>

      <EventTimestamp timestamp={data.timestamp} />

      <div className={styles.eventDescription}>
        {content.subscriber ? (
          <>
            <span className={styles.eventUsername}>
              <span
                style={{
                  color: CommonUtils.getUserIdColor({
                    preferredColor: content.subscriber.preferredColor,
                    userId: content.subscriber.userId,
                  }),
                }}
              >
                {content.subscriber.userTag}
              </span>
            </span>{' '}
            renewed their subscription
            <span className={styles.eventDescriptionSecondary}>
              Total {channelBadge?.level || 2} months
            </span>
          </>
        ) : (
          <>
            <span className={styles.eventUsername}>Mysterious Stranger</span> renewed
            their subscription
            <span className={styles.eventDescriptionSecondary}>
              Total {channelBadge?.level || 2} months
            </span>
          </>
        )}
      </div>

      {showAvatars && (
        <div className={styles.eventUserAvatarsWrapper}>
          {content.subscriber && (
            <div className={styles.eventUserAvatar}>
              <ProfileImage
                profile={content.subscriber}
                size="xs"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
