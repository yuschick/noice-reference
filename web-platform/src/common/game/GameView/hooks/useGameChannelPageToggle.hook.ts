import { FTUEActionType, useTriggerFTUEAction } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { CSSProperties, RefObject, useCallback, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { Routes } from '@common/route';
import { StreamViewState, useStreamState } from '@common/stream';

interface Props {
  streamWrapperRef: RefObject<HTMLDivElement>;
  channelName: Nullable<string>;
}

interface HookResults {
  wrapperStyles?: CSSProperties;
  onChannelPageButtonClick(): void;
  onReturnToStreamClick(): void;
}

const getChannelUrl = (channelName: string) =>
  Routes.Channel.replace(':channelName', channelName.toLowerCase());

export function useGameChannelPageToggle({
  channelName,
  streamWrapperRef,
}: Props): HookResults {
  const { streamViewState, setStreamViewState } = useStreamState();

  const [channelPageWrapperStyles, setChannelPageWrapperStyles] =
    useState<CSSProperties>();

  const triggerFTUEAction = useTriggerFTUEAction();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    // Do nothing if not channel page mode
    if (streamViewState !== StreamViewState.ChannelPage) {
      return;
    }

    // Function to place the stream to the correct place in channel page
    const placeStreamToChannelPage = () => {
      if (!streamWrapperRef.current) {
        return;
      }

      const { width, height, left, top } =
        streamWrapperRef.current.getBoundingClientRect();

      setChannelPageWrapperStyles({
        insetBlockStart: `${top + window.scrollY}px`,
        insetInlineStart: `${left}px`,
        inlineSize: `${width}px`,
        blockSize: `${height}px`,
      });
    };

    // Add event listener for channel page positioning
    window.addEventListener('resize', placeStreamToChannelPage);

    // Get the correct size for init
    placeStreamToChannelPage();

    return () => {
      window.removeEventListener('resize', placeStreamToChannelPage);
    };
  }, [streamViewState, streamWrapperRef]);

  const onChannelPageButtonClick = () => {
    setStreamViewState(StreamViewState.ChannelPage);

    /*
      Because there are multiple channel pages,
      force navigate to Channel Home
    */
    const route = getChannelUrl(channelName ?? '');
    navigate(route);
  };

  const onReturnToStreamClick = useCallback(() => {
    if (streamViewState === StreamViewState.ChannelPage) {
      const route = getChannelUrl(channelName ?? '');
      if (route) {
        navigate(route);
      }
      setStreamViewState(StreamViewState.Full);
      return;
    }

    triggerFTUEAction(FTUEActionType.PiPOpen);
    const route = getChannelUrl(channelName ?? '');
    navigate(route, { state: { joinGame: true } });
    setStreamViewState(StreamViewState.Full);
  }, [navigate, setStreamViewState, streamViewState, channelName, triggerFTUEAction]);

  return {
    wrapperStyles:
      streamViewState !== StreamViewState.ChannelPage
        ? undefined
        : channelPageWrapperStyles,
    onChannelPageButtonClick,
    onReturnToStreamClick,
  };
}
