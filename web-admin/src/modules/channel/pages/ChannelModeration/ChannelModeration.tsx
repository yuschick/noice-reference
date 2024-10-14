import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { DateAndTimeUtils } from '@noice-com/utils';
import { useState } from 'react';
import { useParams } from 'react-router';

import styles from './ChannelModeration.module.css';
import { ForceChannelOfflineModal } from './ForceChannelOfflineModal/ForceChannelOfflineModal';

import { Button, ButtonLink } from '@common/button';
import { StreamingDisabledPill } from '@common/moderation/ModerationStatusPill';
import { ModeratorActionData } from '@common/moderation/ModeratorActionData';
import { ContentModulePage } from '@common/page-components';
import { useChannelModerationQuery, useLiftForceChannelOfflineMutation } from '@gen';

gql`
  query ChannelModeration($channelId: ID!) {
    channel(id: $channelId) {
      features {
        streaming {
          enabled
          suspension {
            until
            moderator {
              ...ModeratorProfile
            }
            suspendedAt
            description
          }
        }
      }
      ...ForceChannelOfflineModalChannel
    }
  }
  mutation LiftForceChannelOffline($channelId: ID!) {
    unsuspendChannelFeature(feature: CHANNEL_FEATURE_STREAMING, channelId: $channelId) {
      emptyTypeWorkaround
    }
  }
`;

export function ChannelModeration() {
  const { channelId } = useParams();
  const { data, loading, error, refetch } = useChannelModerationQuery({
    ...variablesOrSkip({ channelId }),
  });

  const [showForceChannelOfflineModal, setShowForceChannelOfflineModal] = useState(false);
  const [liftForceChannelOffline] = useLiftForceChannelOfflineMutation();

  if (loading) {
    return <ContentModulePage.Loading />;
  }

  if (error || !data?.channel || !channelId) {
    return <ContentModulePage.Error />;
  }

  return (
    <ContentModulePage isOneColumnPage>
      <ContentModulePage.Content title="Actions">
        <div className={styles.action}>
          <div>
            <div className={styles.title}>Force channel offline</div>
            <div className={styles.subtitle}>
              {!data.channel.features.streaming.suspension ? (
                'Take the channel offline immediately and restrict streaming for 24 hours.'
              ) : (
                <div>
                  <StreamingDisabledPill />
                  {!!data.channel.features.streaming.suspension.until && (
                    <span className={styles.expirationInfo}>
                      Expires on{' '}
                      <time
                        dateTime={DateAndTimeUtils.getHTMLAttributeTime(
                          data.channel.features.streaming.suspension.until,
                        )}
                      >
                        {DateAndTimeUtils.getShortDate(
                          data.channel.features.streaming.suspension.until,
                        )}{' '}
                        at{' '}
                        {DateAndTimeUtils.getTime(
                          data.channel.features.streaming.suspension.until,
                        )}
                      </time>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          {data.channel.features.streaming.enabled ? (
            <Button
              buttonType="ghost"
              text="Force channel offline"
              onClick={() => setShowForceChannelOfflineModal(true)}
            />
          ) : (
            <Button
              buttonType="ghost"
              text="Lift Force channel offline"
              onClick={() => {
                liftForceChannelOffline({ variables: { channelId } });
                refetch();
              }}
            />
          )}
        </div>
        {data.channel.features.streaming.suspension && (
          <ModeratorActionData
            actionTimestamp={data.channel.features.streaming.suspension.suspendedAt}
            moderator={data.channel.features.streaming.suspension.moderator ?? null}
            note={data.channel.features.streaming.suspension.description}
          />
        )}
      </ContentModulePage.Content>
      <ContentModulePage.Content title="Moderation & Policies">
        <div className={styles.action}>
          <div>
            <div className={styles.title}>Banned users</div>
            <div className={styles.subtitle}>
              View all users who have been banned from the channel either by the streamer
              or a channel moderator.
            </div>
          </div>
          <ButtonLink
            buttonType="ghost"
            text="See all banned users"
            to={`${location.pathname}/banned`}
          />
        </div>
      </ContentModulePage.Content>
      <ForceChannelOfflineModal
        channel={data.channel}
        open={showForceChannelOfflineModal}
        onClose={() => setShowForceChannelOfflineModal(false)}
        onSubmit={() => {
          setShowForceChannelOfflineModal(false);
          refetch();
        }}
      />
    </ContentModulePage>
  );
}
