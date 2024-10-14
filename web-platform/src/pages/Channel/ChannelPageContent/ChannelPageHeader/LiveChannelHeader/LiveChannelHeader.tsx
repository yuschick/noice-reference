import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { useMountEffect } from '@noice-com/common-react-core';
import { ButtonLink, Icon, Image, useAuthenticatedUser } from '@noice-com/common-ui';
import { StreamPlacement } from '@noice-com/schemas/stream/egress.pb';
import { useParty } from '@noice-com/social';
import { StreamError, StreamSettingsProvider } from '@noice-com/stream';
// We need to import this directly because of @livepeer related importing issue with jest
// eslint-disable-next-line no-restricted-imports
import { SimpleStreamPlayer } from '@noice-com/stream/src/components/SimpleStreamPlayer';
import classNames from 'classnames';
import { useCallback, useState } from 'react';

import { ChannelFriendsList } from './ChannelFriendsList/ChannelFriendsList';
import { LiveChannelButtonWrapper } from './LiveChannelButtonWrapper';
import styles from './LiveChannelHeader.module.css';
import { LiveChannelHeaderStreamInfo } from './LiveChannelHeaderStreamInfo/LiveChannelHeaderStreamInfo';

import { Routes } from '@common/route';
import { useStreamState, useStreamGame } from '@common/stream';
import { LiveChannelHeaderChannelFragment, useLiveChannelHeaderProfileQuery } from '@gen';

gql`
  fragment LiveChannelHeaderChannel on ChannelChannel {
    currentStreamId
    thumbnail
    matureRatedContent
    ...ChannelFriendsListChannel
    ...LiveChannelHeaderStreamInfoChannel
    ...LiveChannelButtonWrapperChannel
  }

  query LiveChannelHeaderProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      account {
        uid
        matureRatedContentAllowed
      }
    }
  }
`;

interface Props {
  channel: LiveChannelHeaderChannelFragment;
}

export function LiveChannelHeader({ channel }: Props) {
  const { partyId, isPartyLeader } = useParty();
  const { streamId: joinedStreamId } = useStreamGame();
  const { userId } = useAuthenticatedUser();
  const [hasTooManyViewers, setHasTooManyViewers] = useState(false);

  const { currentStreamId, thumbnail, matureRatedContent } = channel;

  const { data: profileData, loading } = useLiveChannelHeaderProfileQuery({
    variables: {
      userId,
    },
  });
  const profile = profileData?.profile;

  const { streamWrapperRef } = useStreamState();

  const hasJoinedChannelsStream = joinedStreamId && joinedStreamId === currentStreamId;
  const cannotJoinGameFromParty = !!partyId && !isPartyLeader;

  const isStreamPreviewDisabled =
    hasTooManyViewers ||
    (matureRatedContent && !loading && !profile?.account?.matureRatedContentAllowed);

  const onStreamError = useCallback((error: StreamError) => {
    if (error === StreamError.TooManyViewers) {
      setHasTooManyViewers(true);
    }
  }, []);

  useMountEffect(() => {
    document
      .querySelector('[data-channel-page-content]')
      ?.classList.add(styles.channelPageContent);

    // This is for triggering the channel page to go in correct place, after the header is mounted
    window.dispatchEvent(new Event('resize'));

    () => {
      document
        .querySelector('[data-channel-page-content]')
        ?.classList.remove(styles.channelPageContent);
    };
  });

  if (hasJoinedChannelsStream) {
    return (
      <div className={styles.backgroundWrapper}>
        <div className={styles.streamWrapper}>
          <div className={styles.content}>
            <div
              className={styles.stream}
              ref={streamWrapperRef}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.joiningDisabled]: hasTooManyViewers,
        [styles.matureRatedContent]: matureRatedContent,
      })}
    >
      {hasTooManyViewers && (
        <div className={styles.tooManyViewersBanner}>
          <div className={styles.tooManyViewersBannerContent}>
            <Icon
              className={styles.tooManyViewersBannerIcon}
              icon={CoreAssets.Icons.Exclamation}
            />

            <span>
              <strong>The stream is quite popular right now.</strong> Many users are
              currently enjoying the stream. Please try again later or browse other
              channels.
            </span>
          </div>

          <div>
            <ButtonLink
              level="primary"
              size="sm"
              theme="dark"
              to={Routes.Home}
            >
              Browse other channels
            </ButtonLink>
          </div>
        </div>
      )}

      <div className={styles.backgroundWrapper}>
        <div className={styles.streamWrapper}>
          <div className={styles.content}>
            <LiveChannelButtonWrapper
              buttonClassName={styles.buttonWrapper}
              cannotJoinGameFromParty={cannotJoinGameFromParty}
              channel={channel}
              className={styles.stream}
              hasTooManyViewers={hasTooManyViewers}
            >
              {isStreamPreviewDisabled ? (
                <Image
                  className={styles.streamContent}
                  height="100%"
                  src={thumbnail}
                  width="100%"
                />
              ) : (
                <div className={styles.streamContent}>
                  <StreamSettingsProvider>
                    <SimpleStreamPlayer
                      placement={StreamPlacement.STREAM_PLACEMENT_CHANNEL_VIEW}
                      streamId={currentStreamId}
                      isMutedStream
                      onErrorCallback={onStreamError}
                    />
                  </StreamSettingsProvider>
                </div>
              )}

              <LiveChannelHeaderStreamInfo channel={channel} />
            </LiveChannelButtonWrapper>

            {!hasTooManyViewers && profile && cannotJoinGameFromParty && (
              <div className={styles.cannotJoinGameFromPartyWarning}>
                <span className={styles.partyWarningTitle}>You are in a party</span>
                <span>Only the party leader can join a game</span>
              </div>
            )}
          </div>

          <ChannelFriendsList
            channel={channel}
            className={styles.friends}
          />
        </div>
      </div>
    </div>
  );
}
