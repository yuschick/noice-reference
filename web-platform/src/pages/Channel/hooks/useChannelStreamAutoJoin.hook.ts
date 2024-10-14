import { gql } from '@apollo/client';
import { useAuthentication } from '@noice-com/common-ui';
import { useParty } from '@noice-com/social';
import { useRef, useState } from 'react';
import { matchRoutes, useLocation } from 'react-router';

import { useMatureRatedContentDialog } from '@common/channel';
import { CHANNEL_STORE_ANCHOR, channelSubRoutes } from '@common/route';
import { useListenSessionStorageValue } from '@common/session-storage';
import {
  StreamViewState,
  useSpectatorModeEnabled,
  useStreamState,
  useStreamGame,
} from '@common/stream';
import {
  ChannelLiveStatus,
  ChannelPageEntryChannelQuery,
  ChannelStreamAutoJoinChannelFragment,
} from '@gen';

gql`
  fragment ChannelStreamAutoJoinChannel on ChannelChannel {
    id
    currentStreamId
    liveStatus
    name
    ...MatureRatedContentDialogChannel
  }
`;

interface HookResults {
  isTryingToAutoJoinGame: boolean;
  onChannelDataCompleted: (data: ChannelPageEntryChannelQuery) => void;
}

export function useChannelStreamAutoJoin(): HookResults {
  const { userId } = useAuthentication();
  const {
    streamId: activeStreamId,
    joinGame,
    spectateGame,
    isJoiningGame,
  } = useStreamGame();
  const location = useLocation();
  const { partyId, isPartyLeader, partyStreamId } = useParty();
  const spectatorModeEnabled = useSpectatorModeEnabled();
  const { setStreamViewState, streamViewState } = useStreamState();
  const [storageActiveStreamId, setStorageActiveStreamId] = useListenSessionStorageValue(
    'gameStream.active.streamId',
  );
  const [storageIsSoloPlay, setStorageIsSoloPlay] = useListenSessionStorageValue(
    'gameStream.active.isSoloPlay',
  );

  const isLocationChannelSubRoute = !!matchRoutes(channelSubRoutes, location);
  const [isTryingToAutoJoinGame, setIsTryingToAutoJoinGame] = useState(
    !isLocationChannelSubRoute,
  );

  const { getWhatDialogShouldBeShown, onShowMatureRatedContentDialog } =
    useMatureRatedContentDialog();

  const prevStreamViewState = useRef(streamViewState);

  const onJoinGame = (currentStreamId: string, isSolo?: boolean) => {
    setIsTryingToAutoJoinGame(false);
    joinGame(currentStreamId, {
      isSolo,
    });
  };

  const joinStorageStream = (currentStreamId: string) => {
    // If storage id does not match current channel's stream id, clear storage and exit
    if (storageActiveStreamId !== currentStreamId) {
      setStorageActiveStreamId('');
      setStorageIsSoloPlay(false);
      return false;
    }

    // Store current state
    prevStreamViewState.current = streamViewState;

    setStreamViewState(StreamViewState.Full);
    onJoinGame(currentStreamId, storageIsSoloPlay);

    return true;
  };

  const join = async (channel: ChannelStreamAutoJoinChannelFragment) => {
    // Store current state
    prevStreamViewState.current = streamViewState;
    // Set stream view state to full
    setStreamViewState(StreamViewState.Full);

    const dialog = await getWhatDialogShouldBeShown({ channel, usedInChannelPage: true });

    if (!dialog) {
      onJoinGame(channel.currentStreamId);
      return true;
    }

    await onShowMatureRatedContentDialog({
      dialog,
      channelId: channel.id,
      onJoinGame: async () => {
        onJoinGame(channel.currentStreamId);
      },
    });
    return true;
  };

  const onChannelDataCompleted = (data: ChannelPageEntryChannelQuery) => {
    if (!userId) {
      setIsTryingToAutoJoinGame(false);
      return;
    }

    // Ignore if in channel sub route
    if (isLocationChannelSubRoute) {
      return;
    }

    // If hash is channel store, do nothing
    if (location.hash === `#${CHANNEL_STORE_ANCHOR}`) {
      setIsTryingToAutoJoinGame(false);
      return;
    }

    // If not live, do nothing
    if (
      !data.channelByName?.currentStreamId ||
      data.channelByName.liveStatus !== ChannelLiveStatus.LiveStatusLive
    ) {
      setIsTryingToAutoJoinGame(false);
      return;
    }

    // If there is game going on, or user is joining game, do nothing
    if (activeStreamId || isJoiningGame) {
      setIsTryingToAutoJoinGame(false);
      return;
    }

    const { currentStreamId } = data.channelByName;

    // If on spectator mode, connect to the game in spectator mode
    if (spectatorModeEnabled) {
      spectateGame(currentStreamId);
      setStreamViewState(StreamViewState.Full);
      return;
    }

    // If user is in party, but not leader, they can not join if it is not the party stream
    if (partyId && !isPartyLeader && partyStreamId !== currentStreamId) {
      setIsTryingToAutoJoinGame(false);
      return;
    }

    // Try to join storage stream, if successful, exit
    if (joinStorageStream(currentStreamId)) {
      return;
    }

    // just join live stream with default settings
    join(data.channelByName);
  };

  return {
    onChannelDataCompleted,
    isTryingToAutoJoinGame,
  };
}
