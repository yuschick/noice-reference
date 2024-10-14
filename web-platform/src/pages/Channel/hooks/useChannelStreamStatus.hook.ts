import { gql } from '@apollo/client';
import { useMountEffect } from '@noice-com/common-react-core';
import { Nullable } from '@noice-com/utils';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useDebugContext } from '@common/debug';
import { StreamViewState, useStreamState, useStreamGame } from '@common/stream';
import { ChannelStreamStateChannelFragment } from '@gen';

gql`
  fragment ChannelStreamStateChannel on ChannelChannel {
    id
    currentStreamId
    name
  }
`;

interface Props {
  channel: Nullable<ChannelStreamStateChannelFragment>;
}

export function useChannelStreamStatus({ channel }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    streamId: activeStreamId,
    channelId: activeStreamChannelId,
    joinGame,
  } = useStreamGame();
  const { streamWrapperRef, setStreamViewState, streamViewState } = useStreamState();
  const { forceChannelOnline, setCanForceChannelOnline } = useDebugContext();

  const intersectionObserver = useRef<IntersectionObserver>();

  useMountEffect(() => {
    // Create intersection observer on mount to prevent it be created multiple times
    intersectionObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If it is mainly visible, set stream view state to channel page, otherwise PiP
          setStreamViewState(
            entry.intersectionRatio > 0.5
              ? StreamViewState.ChannelPage
              : StreamViewState.PiP,
          );
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      },
    );

    return () => {
      intersectionObserver.current?.disconnect();
    };
  });

  useEffect(() => {
    // Do nothing if stream wrapper ref is not set
    if (!streamWrapperRef.current || !channel) {
      intersectionObserver.current?.disconnect();
      return;
    }

    // Do nothing if not channel page or PiP
    if (
      streamViewState !== StreamViewState.ChannelPage &&
      streamViewState !== StreamViewState.PiP
    ) {
      intersectionObserver.current?.disconnect();
      return;
    }

    intersectionObserver.current?.observe(streamWrapperRef.current);
  }, [streamWrapperRef, streamViewState, channel]);

  // Change stream state when coming to channel page
  useEffect(() => {
    if (!channel) {
      return;
    }

    setStreamViewState((prev) => {
      // If we are joining the game, set it full
      if (location?.state?.joinGame) {
        return prev;
      }

      if (!activeStreamChannelId) {
        return prev;
      }

      // If current channel is different than instance's channel, set to PiP
      if (channel.id !== activeStreamChannelId) {
        return StreamViewState.PiP;
      }

      // Do nothing when previous was not PiP,
      // or if no stream or channel
      if (prev !== StreamViewState.PiP || !activeStreamId || !channel.currentStreamId) {
        return prev;
      }

      // If entering different channel than instance's channel, set to PiP
      if (activeStreamId !== channel.currentStreamId) {
        return StreamViewState.PiP;
      }

      // When entering same channel, set to channel page
      return StreamViewState.ChannelPage;
    });
  }, [
    activeStreamChannelId,
    activeStreamId,
    channel,
    location?.state?.joinGame,
    setStreamViewState,
  ]);

  // Set force channel online possible when channel has stream
  useEffect(() => {
    setCanForceChannelOnline(!!channel?.currentStreamId);
  }, [channel?.currentStreamId, setCanForceChannelOnline]);

  // Force channel online when it is not live and force is on
  useEffect(() => {
    // If there is not stream, do nothing
    if (!channel?.currentStreamId) {
      return;
    }

    // If force channel online is not enabled, do nothing
    if (!forceChannelOnline) {
      return;
    }

    const triggerJoinGameStream = async () => {
      await joinGame(channel.currentStreamId);
      setStreamViewState(StreamViewState.Full);
      navigate(`/${channel.name}`, { state: { joinGame: true } });
    };

    triggerJoinGameStream();
  }, [
    channel?.currentStreamId,
    channel?.name,
    forceChannelOnline,
    joinGame,
    navigate,
    setStreamViewState,
  ]);
}
