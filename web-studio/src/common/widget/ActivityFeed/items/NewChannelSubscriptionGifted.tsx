import { gql } from '@apollo/client';
import { CommonUtils, Icon, ProfileImage } from '@noice-com/common-ui';
import { GifterBadgeLevel100 } from '@noice-com/social-react-core';
import { useContext } from 'react';

import { ActivityFeedSettingsContext } from '../ActivityFeedSettingsProvider';
import { ActivityItemData } from '../types';

import styles from './ActivityListItem/ActivityListItem.module.css';
import { EventTimestamp } from './EventTimestamp/EventTimestamp';

gql`
  fragment StreamActivityFeedNewChannelSubscriptionGifted on StreamerSubscriptionGifted {
    userId
    tier
    buyer: user {
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
    recipients {
      userId
      userTag
      preferredColor
    }
  }
`;

export function NewChannelSubscriptionGifted({ data }: ActivityItemData) {
  const context = useContext(ActivityFeedSettingsContext);

  if (data?.content?.__typename !== 'StreamerSubscriptionGifted' || !context) {
    return null;
  }

  const { showAvatars } = context;
  const { content } = data;
  const recipients = content.recipients;

  return (
    <>
      <Icon
        className={styles.eventIcon}
        icon={GifterBadgeLevel100}
        size={16}
      />

      <span className={styles.eventType}>Gifted subscription</span>

      <EventTimestamp timestamp={data.timestamp} />

      <div className={styles.eventDescription}>
        <span className={styles.eventUsername}>
          {content.buyer ? (
            <span
              style={{
                color: CommonUtils.getUserIdColor({
                  preferredColor: content.buyer.preferredColor,
                  userId: content.buyer.userId,
                }),
              }}
            >
              {content.buyer.userTag}
            </span>
          ) : (
            'Mysterious Stranger'
          )}
        </span>{' '}
        gifted{' '}
        {recipients && recipients.length > 1
          ? `${recipients.length} subscriptions`
          : 'a subscription'}{' '}
        {!!recipients && (
          <>
            to
            {recipients.map((recipient) => (
              <>
                {' '}
                <span
                  className={styles.eventUsername}
                  key={recipient.userId}
                >
                  <span
                    style={{
                      color: CommonUtils.getUserIdColor({
                        preferredColor: recipient.preferredColor,
                        userId: recipient.userId,
                      }),
                    }}
                  >
                    {recipient.userTag}
                  </span>
                </span>
              </>
            ))}
          </>
        )}
      </div>

      {showAvatars && (
        <div className={styles.eventUserAvatarsWrapper}>
          {content.buyer && (
            <div className={styles.eventUserAvatar}>
              <ProfileImage
                profile={content.buyer}
                size="xs"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
