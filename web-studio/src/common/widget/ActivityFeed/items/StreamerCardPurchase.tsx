import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { CommonUtils, Icon, ProfileImage } from '@noice-com/common-ui';
import { useContext } from 'react';

import { ActivityFeedSettingsContext } from '../ActivityFeedSettingsProvider';
import { ActivityItemData } from '../types';

import styles from './ActivityListItem/ActivityListItem.module.css';
import { EventTimestamp } from './EventTimestamp/EventTimestamp';
import { EventUserBadges } from './EventUserBadges/EventUserBadges';

gql`
  fragment StreamActivityFeedStreamerCardPurchase on StreamerStreamerCardPurchased {
    userId
    streamerCardId
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
    streamerCard {
      name
    }
  }
`;

export function StreamerCardPurchase({ data }: ActivityItemData) {
  const context = useContext(ActivityFeedSettingsContext);

  if (data?.content?.__typename !== 'StreamerStreamerCardPurchased' || !context) {
    return null;
  }

  const { showAvatars } = context;
  const { content } = data;

  return (
    <>
      <Icon
        className={styles.eventIcon}
        color="text-light"
        icon={CoreAssets.Icons.Cards}
        size={16}
      />

      <span className={styles.eventType}>Purchase - Creator card</span>

      <EventTimestamp timestamp={data.timestamp} />

      <div className={styles.eventDescription}>
        {content.buyer ? (
          <>
            <EventUserBadges badges={content.buyer.badges} />
            <span className={styles.eventUsername}>
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
            </span>{' '}
          </>
        ) : (
          <span className={styles.eventUsername}>Mysterious Stranger </span>
        )}
        purchased a new creator card{' '}
        <span className={styles.eventDescriptionSecondary}>
          {content.streamerCard?.name}
        </span>
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
