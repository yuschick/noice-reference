import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import { useAuthentication } from '@noice-com/common-ui';
import { useParty } from '@noice-com/social';
import { Nullable, makeLoggers } from '@noice-com/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  PartyLeaderChangedStreamNotification,
  PartyLeaderChangedStreamNotificationProps,
} from '../../content/PartyLeaderChangedStreamNotification/PartyLeaderChangedStreamNotification';
import { Context } from '../NotificationProvider';

import { AddNotificationResult } from '@common/notification/types';
import { Routes, useIsChannelRoute } from '@common/route';
import { StreamViewState, useStreamState, useStreamGame } from '@common/stream';
import { useUsePartyLeaderStreamChangedPartyQuery } from '@gen';

gql`
  query UsePartyLeaderStreamChangedParty($partyId: ID!) {
    party(partyId: $partyId) {
      id
      leaderId
      channel {
        id
        name
      }
      streamId
      members {
        userId
        profile {
          userId
          userTag
        }
      }
    }
  }
`;

const { logError } = makeLoggers('PartyLeaderChangedStream');

interface CountdownState {
  channelId: Nullable<string>;
  streamId: Nullable<string>;
  leaderName: string;
  channelName: Nullable<string>;
  countdownEndTime: Date;
}

type Props = Pick<Context, 'actions'>;

// @todo: Should handling when you are in the same game and join a party here
// so it is all in one place? (Currently in useGroupChangeListeners)
export function usePartyLeaderChangedStream({ actions }: Props) {
  const { channelPathname } = useIsChannelRoute();
  const { joinGame, streamId: currentStreamId, leaveGame } = useStreamGame();
  const { streamViewState, setStreamViewState } = useStreamState();
  const { partyId } = useParty();

  const { userId } = useAuthentication();
  const navigate = useNavigate();

  const notification =
    useRef<Nullable<AddNotificationResult<PartyLeaderChangedStreamNotificationProps>>>(
      null,
    );

  const [countdownState, setCountdownState] = useState<Nullable<CountdownState>>(null);
  useUsePartyLeaderStreamChangedPartyQuery({
    ...variablesOrSkip({ partyId }),
    onCompleted: (data) => {
      // If no party, do nothing
      if (!data.party) {
        return;
      }

      const {
        party: { channel, leaderId, streamId, members },
      } = data;

      const isLeader = leaderId === userId;
      const isInChannelPage = channel
        ? channelPathname?.includes(channel.name.toLowerCase())
        : false;

      // If we are leader but lost the party stream (e.g. refreshed page when in PiP),
      // and you are not in channel page (since useChannelSubscription handles auto-joining),
      // join again so that the whole party in same place
      if (isLeader && !isInChannelPage && currentStreamId === null && streamId) {
        setStreamViewState(StreamViewState.PiP);
        joinGame(streamId);
        return;
      }

      // No need to trigger any actions if you are the party leader
      if (isLeader) {
        return;
      }

      // If you are not member of party any more, do nothing
      if (!members.some((member) => member.profile.userId === userId)) {
        return;
      }

      // If leader & you not in stream, do nothing
      if (!currentStreamId && !streamId) {
        return;
      }

      // If you are a member & already in the stream, do nothing
      if (currentStreamId === streamId) {
        // There might be a countdown already going for member for stream change
        // but leader came back to the stream so we need to clear it
        setCountdownState(null);
        return;
      }

      const leaderName = members.find((member) => member.profile.userId === leaderId)
        ?.profile.userTag;
      const now = new Date();
      // 5 second countdown
      const countdownEndTime = new Date(now.getTime() + 1000 * 5);

      if (!leaderName) {
        logError('Leader name not found');
        return;
      }

      notification.current = actions.addNotification({
        component: {
          type: PartyLeaderChangedStreamNotification,
          props: {
            leaderName: leaderName,
            icon: CoreAssets.Icons.Group,
            channelName: channel?.name ?? null,
            countdownEndTime,
            onCountdownEnd,
          },
        },
        events: {
          onRemoved: () => {
            notification.current = null;
          },
        },
        options: {
          duration: 5500,
        },
      });

      setCountdownState({
        streamId: streamId ?? null,
        channelId: channel?.id ?? null,
        leaderName: leaderName,
        channelName: channel?.name ?? null,
        countdownEndTime,
      });
    },
  });

  useEffect(() => {
    setCountdownState(null);

    return () => {
      notification.current?.actions.remove();
    };
  }, [currentStreamId]);

  const onCountdownEnd = useCallback(async () => {
    setCountdownState(null);

    // If leader is not in a stream, leave the game and navigate to home
    if (
      !countdownState?.channelName ||
      !countdownState.channelId ||
      !countdownState.streamId
    ) {
      await leaveGame();
      navigate(Routes.Home);
      return;
    }

    // If leader is in another stream, join new stream and navigate to new stream
    if (
      streamViewState === StreamViewState.Full &&
      currentStreamId &&
      currentStreamId !== countdownState.streamId
    ) {
      await joinGame(countdownState.streamId, { isSolo: false });
      navigate(`/${countdownState.channelName.toLowerCase()}`, {
        state: { joinGame: true },
      });
      return;
    }

    // Otherwise just join the user to game
    await joinGame(countdownState.streamId, { isSolo: false });
    setStreamViewState(StreamViewState.PiP);
  }, [
    countdownState,
    currentStreamId,
    streamViewState,
    joinGame,
    leaveGame,
    setStreamViewState,
    navigate,
  ]);

  useEffect(() => {
    notification.current?.actions.update({ onCountdownEnd });
  }, [onCountdownEnd]);
}
