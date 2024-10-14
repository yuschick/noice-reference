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
  fragment StreamActivityFeedAvatarItemPurchase on StreamerAvatarItemPurchased {
    userId
    itemId
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

    item {
      id
      name
      details {
        ...AvatarCosmeticDetails
      }
    }
  }

  fragment AvatarCosmeticDetails on AvatarAvatarPart {
    id
    name
  }
`;

export function AvatarItemPurchase({ data }: ActivityItemData) {
  const context = useContext(ActivityFeedSettingsContext);

  if (data?.content?.__typename !== 'StreamerAvatarItemPurchased' || !context) {
    return null;
  }

  const { showAvatars } = context;
  const { content } = data;

  return (
    <>
      <Icon
        className={styles.eventIcon}
        color="text-light"
        icon={CoreAssets.Icons.Outfit}
        size={16}
      />

      <span className={styles.eventType}>Purchase - Avatar cosmetics</span>

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
        purchased a cosmetic
        {content.item.details?.__typename === 'AvatarAvatarPart' && (
          <span className={styles.eventDescriptionSecondary}>
            {content.item.details.name}
          </span>
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
