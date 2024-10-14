import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { CommonUtils, Icon, ProfileImage } from '@noice-com/common-ui';
import { useContext } from 'react';

import { ActivityFeedSettingsContext } from '../ActivityFeedSettingsProvider';
import { ActivityItemData } from '../types';

import styles from './ActivityListItem/ActivityListItem.module.css';
import { EventTimestamp } from './EventTimestamp/EventTimestamp';
import { EventUserBadges } from './EventUserBadges/EventUserBadges';

import { ProfileProfile, StreamActivityFeedNewChannelFollowerFragment } from '@gen';

gql`
  fragment StreamActivityFeedNewChannelFollower on StreamerChannelFollowed {
    userId
    follower: user {
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

export function NewChannelFollower({ data }: ActivityItemData) {
  const context = useContext(ActivityFeedSettingsContext);

  if (data?.content?.__typename !== 'StreamerChannelFollowed' || !context) {
    return null;
  }

  const { showAvatars } = context;
  const { content } = data;
  const details = {
    ...content,
  } as StreamActivityFeedNewChannelFollowerFragment & { followers: ProfileProfile[] };

  // The first viewer in the list is the main viewer
  const mainFollower = content.follower;

  // The rest of the viewers to join during the batching timeout
  // Filter out duplicate viewers who entered the stream multiple times
  const tempFollowers: string[] = [];
  const otherFollowers =
    details.followers?.filter((follower) => {
      const keep =
        follower.userId !== mainFollower.userId &&
        !tempFollowers.includes(follower.userId);
      tempFollowers.push(follower.userId);

      return keep;
    }) || [];

  return (
    <>
      <Icon
        className={styles.eventIcon}
        color="status-error-main"
        icon={CoreAssets.Icons.Heart}
        size={16}
      />

      <span className={styles.eventType}>
        New {otherFollowers.length ? 'followers' : 'follower'}
      </span>

      <EventTimestamp timestamp={data.timestamp} />

      <div className={styles.eventDescription}>
        <>
          <EventUserBadges badges={content.follower.badges} />
          <span className={styles.eventUsername}>
            <span
              style={{
                color: CommonUtils.getUserIdColor({
                  preferredColor: mainFollower.preferredColor,
                  userId: mainFollower.userId,
                }),
              }}
            >
              {mainFollower.userTag}
            </span>
          </span>{' '}
        </>
        started following
        {!!otherFollowers.length && (
          <span>
            {' '}
            along with{' '}
            {otherFollowers.map((other) => (
              <span
                className={styles.eventUsername}
                key={other.userId}
              >
                <span
                  style={{
                    color: CommonUtils.getUserIdColor({
                      preferredColor: other.preferredColor,
                      userId: other.userId,
                    }),
                  }}
                >
                  {other.userTag}
                </span>{' '}
              </span>
            ))}
          </span>
        )}
      </div>

      {showAvatars && (
        <div className={styles.eventUserAvatarsWrapper}>
          {mainFollower && (
            <div className={styles.eventUserAvatar}>
              <ProfileImage
                profile={mainFollower}
                size="xs"
              />
            </div>
          )}
          {!!otherFollowers.length && (
            <>
              {otherFollowers.map((other) => (
                <div
                  className={styles.eventUserAvatar}
                  key={other.userId}
                >
                  <ProfileImage
                    profile={other}
                    size="xs"
                  />
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </>
  );
}
