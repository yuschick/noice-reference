import { useEffect, useRef, useState } from 'react';

import { ChatChannel } from '../types';

import { useLastChannelMessageTimes } from './useLastChannelMessageTimes.hook';

import { useUnreadFlags } from '@context';

interface Props {
  activeChannel: ChatChannel;
  chatTabIsActive: boolean;
}

export function useChatChannelUnreadStatus({
  activeChannel,
  chatTabIsActive,
}: Props): void {
  const { markFlagRead, markFlagUnread } = useUnreadFlags();
  const [lastReadStreamMessageTime, setLastReadStreamMessageTime] = useState<Date>(
    new Date(),
  );
  const [lastReadGroupMessageTime, setLastReadGroupMessageTime] = useState<Date>(
    new Date(),
  );

  const startTrackingUnreadState = useRef<boolean>(false);

  const { lastStreamMessageTime, lastGroupMessageTime, loading } =
    useLastChannelMessageTimes();

  useEffect(() => {
    // If tab is not active, nothing is read
    if (!chatTabIsActive) {
      return;
    }

    if (activeChannel === ChatChannel.Stream && lastStreamMessageTime) {
      markFlagRead('streamMessages');
      setLastReadStreamMessageTime(lastStreamMessageTime);
      return;
    }

    if (activeChannel === ChatChannel.Group && lastGroupMessageTime) {
      markFlagRead('groupMessages');
      setLastReadGroupMessageTime(lastGroupMessageTime);
    }
  }, [
    activeChannel,
    chatTabIsActive,
    lastGroupMessageTime,
    lastStreamMessageTime,
    markFlagRead,
  ]);

  useEffect(() => {
    const unnoticedGroupMessageAppeard =
      lastGroupMessageTime &&
      lastGroupMessageTime > lastReadGroupMessageTime &&
      (!chatTabIsActive || activeChannel !== ChatChannel.Group) &&
      startTrackingUnreadState.current;

    if (unnoticedGroupMessageAppeard) {
      markFlagUnread('groupMessages');
    }
  }, [
    lastGroupMessageTime,
    activeChannel,
    lastReadGroupMessageTime,
    markFlagUnread,
    chatTabIsActive,
  ]);

  useEffect(() => {
    const unnoticedStreamMessageAppeard =
      lastStreamMessageTime &&
      lastStreamMessageTime > lastReadStreamMessageTime &&
      (!chatTabIsActive || activeChannel !== ChatChannel.Stream) &&
      startTrackingUnreadState.current;

    if (unnoticedStreamMessageAppeard) {
      markFlagUnread('streamMessages');
    }
  }, [
    lastStreamMessageTime,
    activeChannel,
    lastReadStreamMessageTime,
    markFlagUnread,
    chatTabIsActive,
  ]);

  // We don't want to show unread dots for the fetched chat history
  // messages, only for the ones that arrived AFTER we fetched the history which
  // user has missed.
  useEffect(() => {
    if (!loading && !startTrackingUnreadState.current) {
      startTrackingUnreadState.current = true;
    } else if (loading) {
      startTrackingUnreadState.current = false;
    }
  }, [loading]);
}
