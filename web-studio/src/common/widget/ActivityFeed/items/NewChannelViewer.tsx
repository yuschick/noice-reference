import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { CommonUtils, Icon, ProfileImage } from '@noice-com/common-ui';
import { useContext } from 'react';

import { ActivityFeedSettingsContext } from '../ActivityFeedSettingsProvider';
import { ActivityItemData } from '../types';

import styles from './ActivityListItem/ActivityListItem.module.css';
import { EventTimestamp } from './EventTimestamp/EventTimestamp';
import { EventUserBadges } from './EventUserBadges/EventUserBadges';

import { ProfileProfile, StreamActivityFeedNewChannelViewerFragment } from '@gen';

gql`
  fragment StreamActivityFeedNewChannelViewer on StreamerPlayerJoined {
    userId
    viewer: user {
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

export function NewChannelViewer({ data }: ActivityItemData) {
  const context = useContext(ActivityFeedSettingsContext);

  if (data?.content?.__typename !== 'StreamerPlayerJoined' || !context) {
    return null;
  }

  const { showAvatars } = context;
  const { content } = data;
  const details = {
    ...content,
  } as StreamActivityFeedNewChannelViewerFragment & { viewers: ProfileProfile[] };

  // The first viewer in the list is the main viewer
  const mainViewer = content.viewer;

  // The rest of the viewers to join during the batching timeout
  // Filter out duplicate viewers who entered the stream multiple times
  const tempViewers: string[] = [];
  const otherViewers =
    details.viewers?.filter((viewer) => {
      const keep =
        viewer.userId !== mainViewer.userId && !tempViewers.includes(viewer.userId);
      tempViewers.push(viewer.userId);

      return keep;
    }) ?? [];

  return (
    <>
      <Icon
        className={styles.eventIcon}
        color="text-light"
        icon={CoreAssets.Icons.Eye}
        size={16}
      />

      <span className={styles.eventType}>
        New {otherViewers.length ? 'viewers' : 'viewer'}
      </span>

      <EventTimestamp timestamp={data.timestamp} />

      <div className={styles.eventDescription}>
        <>
          <EventUserBadges badges={content.viewer.badges} />
          <span className={styles.eventUsername}>
            <span
              style={{
                color: CommonUtils.getUserIdColor({
                  preferredColor: mainViewer.preferredColor,
                  userId: mainViewer.userId,
                }),
              }}
            >
              {mainViewer.userTag}
            </span>
          </span>{' '}
        </>
        joined the stream
        {!!otherViewers.length && (
          <span>
            {' '}
            along with{' '}
            {otherViewers.map((other) => (
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
          {mainViewer && (
            <div className={styles.eventUserAvatar}>
              <ProfileImage
                profile={mainViewer}
                size="xs"
              />
            </div>
          )}
          {!!otherViewers.length && (
            <>
              {otherViewers.map((other) => (
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
