import { gql } from '@apollo/client';
import { Icon } from '@noice-com/common-ui';
import { DateAndTimeUtils, makeLoggers } from '@noice-com/utils';

import styles from './ModerationLogEvent.module.css';
import { ModerationLogUser } from './ModerationLogUser';
import { getModerationEventDescription, getModerationEventMeta } from './util';

import { ModerationLogEventFragment } from '@gen';

const { logWarn } = makeLoggers('ModerationLog');

export function ModerationLogEvent({ moderator, ...event }: ModerationLogEventFragment) {
  const content = event?.content.content;
  const meta = getModerationEventMeta(content);
  const description = getModerationEventDescription(content);

  if (!meta) {
    logWarn('Not supported moderation event: ' + content?.__typename);
    return null;
  }

  return (
    <div
      className={styles.event}
      id={event.id}
    >
      <div className={styles.icon}>
        <Icon
          className={styles[meta.color]}
          icon={meta.icon}
        />
      </div>
      <div className={styles.description}>
        <h3 className={styles.title}>{meta.title}</h3>
        <div className={styles.target}>
          {!!description?.user && <ModerationLogUser profile={description.user} />}
          {!!description?.summary && (
            <span className={styles.summary}>{description.summary}</span>
          )}
        </div>
        {!!description?.message && (
          <div className={styles.message}>{description.message}</div>
        )}
      </div>
      <div className={styles.moderator}>
        <time
          className={styles.time}
          dateTime={new Date(event.timestamp).toISOString()}
        >
          {DateAndTimeUtils.getShortDate(event.timestamp)}{' '}
          {DateAndTimeUtils.getTime(event.timestamp)}
        </time>
        {moderator && (
          <ModerationLogUser
            profile={moderator}
            isModerator
          />
        )}
      </div>
    </div>
  );
}

ModerationLogEvent.fragments = {
  entry: gql`
    fragment ModerationLogEvent on ChannelModerationEvent {
      id
      channelId
      moderator {
        ...ModerationLogUser
      }
      timestamp
      content {
        content {
          ... on ChannelUserMuted {
            duration
            reason
            description
            user {
              userId
              ...ModerationLogUser
            }
            userId
          }
          ... on ChannelUserBanned {
            description
            violation
            user {
              userId
              ...ModerationLogUser
            }
            userId
          }
          ... on ChannelUserUnbanned {
            user {
              userId
              ...ModerationLogUser
            }
            userId
          }
          ... on ChannelBanAppealAccepted {
            comment
            user {
              userId
              ...ModerationLogUser
            }
            userId
          }
          ... on ChannelBanAppealRejected {
            comment
            user {
              userId
              ...ModerationLogUser
            }
            userId
          }
          ... on ChannelAutomodItemAccepted {
            message {
              content {
                ... on ChatTextMessage {
                  text
                }
              }
            }
            user {
              userId
              ...ModerationLogUser
            }
            userId
          }
          ... on ChannelAutomodItemRejected {
            message {
              content {
                ... on ChatTextMessage {
                  text
                }
              }
            }
            user {
              userId
              ...ModerationLogUser
            }
            userId
          }
        }
      }
    }
  `,
};
