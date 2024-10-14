import { useMountEffect } from '@noice-com/common-react-core';
import { useMediaQuery } from '@noice-com/common-ui';
import { StreamPlacement } from '@noice-com/schemas/stream/egress.pb';
import { StreamError } from '@noice-com/stream';
// We need to import this directly because of @livepeer related importing issue with jest
// eslint-disable-next-line no-restricted-imports
import { SimpleStreamPlayer } from '@noice-com/stream/src/components/SimpleStreamPlayer';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ChannelSectionSm } from '../ChannelSectionSm';

import styles from './MobileStream.module.css';

import { StreamViewState, useStreamState } from '@common/stream';

interface Props {
  channelId?: string;
  streamId: string;
  groupId: Nullable<string>;
  isMatchEndShowing: boolean;
  isGuideToMetaGameShowing: boolean;
  isMinimizedStream?: boolean;
  hideSpotlights?: boolean;
  isChatOpen?: boolean;
  onTooManyViewersErrorCallback: () => void;
  onChannelPageButtonClick(): void;
}

const HIDE_CHANNEL_OVERLAY_AFTER_MS = 3000;
export function MobileStream({
  channelId,
  streamId,
  groupId,
  isMinimizedStream,
  hideSpotlights,
  onTooManyViewersErrorCallback,
  onChannelPageButtonClick,
  isMatchEndShowing,
  isGuideToMetaGameShowing,
  isChatOpen,
}: Props) {
  const [videoPlayerElement, setVideoPlayerElement] =
    useState<Nullable<HTMLVideoElement>>(null);
  const [isChannelOverlayShown, setIsChannelOverlayShown] = useState(true);
  const { streamViewState } = useStreamState();
  const channelOverlayTimeoutIdRef = useRef<number>();
  const isLandscape = useMediaQuery('(orientation: landscape)');

  useMountEffect(() => {
    return () => {
      clearTimeout(channelOverlayTimeoutIdRef.current);
    };
  });

  const isFullMode = streamViewState === StreamViewState.Full;
  const onErrorCallback = useCallback(
    (error: StreamError) => {
      if (error === StreamError.TooManyViewers) {
        onTooManyViewersErrorCallback?.();
      }
    },
    [onTooManyViewersErrorCallback],
  );

  const shouldNotShowChannelOverlay =
    !isFullMode || (isLandscape && isGuideToMetaGameShowing) || isChatOpen;

  useEffect(() => {
    if (shouldNotShowChannelOverlay) {
      hideChannelOverlay();
    }
  }, [isChatOpen, isFullMode, isMatchEndShowing, shouldNotShowChannelOverlay]);

  const showChannelOverlay = () => {
    channelOverlayTimeoutIdRef.current = window.setTimeout(() => {
      setIsChannelOverlayShown(false);
    }, HIDE_CHANNEL_OVERLAY_AFTER_MS);
    setIsChannelOverlayShown(true);
  };

  const hideChannelOverlay = () => {
    setIsChannelOverlayShown(false);
    clearTimeout(channelOverlayTimeoutIdRef.current);
  };

  const onStreamPlayerClick = () => {
    if (shouldNotShowChannelOverlay) {
      return;
    }

    if (isChannelOverlayShown) {
      hideChannelOverlay();
      return;
    }

    showChannelOverlay();
  };

  const onVideoPlayerInit = (elem: Nullable<HTMLVideoElement>) => {
    setVideoPlayerElement(elem);
    showChannelOverlay();
  };

  return (
    <div
      className={classNames(styles.mobileStreamRoot, {
        [styles.minimized]: isMinimizedStream,
      })}
    >
      <SimpleStreamPlayer
        className={styles.mobileStreamVideo}
        groupId={groupId}
        hideSpotlights={hideSpotlights || isMinimizedStream}
        placement={StreamPlacement.STREAM_PLACEMENT_GAME_VIEW}
        streamId={streamId}
        hideSpotlightsEmotes
        onErrorCallback={onErrorCallback}
        onPlayerInit={onVideoPlayerInit}
        onStreamPlayerClick={onStreamPlayerClick}
      />
      {!!channelId && videoPlayerElement && (
        <ChannelSectionSm
          channelId={channelId}
          isShown={isChannelOverlayShown}
          videoPlayerElement={videoPlayerElement}
          onButtonClick={hideChannelOverlay}
          onChannelPageButtonClick={onChannelPageButtonClick}
        />
      )}
    </div>
  );
}
