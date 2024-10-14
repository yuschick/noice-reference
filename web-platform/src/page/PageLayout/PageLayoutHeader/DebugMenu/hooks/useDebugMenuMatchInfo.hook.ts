import { gql } from '@apollo/client';
import { useCardGameGroup } from '@noice-com/card-game';
import { useAuthentication } from '@noice-com/common-ui';
import { StreamStateMatchState } from '@noice-com/schemas/game-logic/game_logic.pb';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { DebugMenuItem } from '../types';

import { useStreamGame } from '@common/stream';
import { DebugMenuMatchInfoProfileFragment } from '@gen';

gql`
  fragment DebugMenuMatchInfoProfile on ProfileProfile {
    userTag
  }
`;

interface HookResult {
  showMatch: boolean;
  matchInfos: DebugMenuItem[];
  matchInfoString: string;
  toggleShowMatch(): void;
}

const NO_GROUP_TEXT = '<no group>';
const NO_STREAM_ID_TEXT = '<no id>';
const NO_SEASON_ID_TEXT = '<no season_id>';

interface Props {
  profile: Nullable<DebugMenuMatchInfoProfileFragment>;
}

export function useDebugMenuMatchInfo({ profile }: Props): HookResult {
  const { userId } = useAuthentication();
  const { streamId, gameInstance, channelId } = useStreamGame();
  const group = useCardGameGroup();

  const [showMatch, setShowMatch] = useState(true);
  const [streamState, setStreamState] = useState<StreamStateMatchState>(
    StreamStateMatchState.MATCH_STATE_UNSPECIFIED,
  );
  const [groupName, setGroupName] = useState(NO_GROUP_TEXT);
  const [groupID, setGroupID] = useState(NO_GROUP_TEXT);

  // Update group info
  useEffect(() => {
    setGroupName(group?.name ?? NO_GROUP_TEXT);
    setGroupID(group?.groupID ?? NO_GROUP_TEXT);
  }, [group]);

  // Update stream info
  useEffect(() => {
    // Reset all
    if (!gameInstance) {
      setGroupName(NO_GROUP_TEXT);
      setGroupID(NO_GROUP_TEXT);
      setStreamState(StreamStateMatchState.MATCH_STATE_UNSPECIFIED);
      return;
    }

    // Sub for match state changes.
    const updateStreamInfo = () => {
      setStreamState(
        gameInstance?.matchState ?? StreamStateMatchState.MATCH_STATE_UNSPECIFIED,
      );
    };

    updateStreamInfo();
    gameInstance?.addListener('onMatchStateChanged', updateStreamInfo);

    return () => {
      gameInstance?.removeListener('onMatchStateChanged', updateStreamInfo);
    };
  }, [gameInstance]);

  const matchInfos = useMemo(
    () => [
      {
        label: 'Local player',
        value: profile?.userTag ?? '<unknown>',
      },
      {
        label: 'Local user ID',
        value: userId ?? '-',
      },
      {
        label: 'Match state',
        value: streamState,
      },
      {
        label: 'Stream id',
        value: streamId ?? NO_STREAM_ID_TEXT,
      },
      {
        label: 'Channel id',
        value: channelId ?? NO_STREAM_ID_TEXT,
      },
      {
        label: 'Group name',
        value: groupName,
      },
      {
        label: 'Group ID',
        value: groupID,
      },
      {
        label: 'Season ID',
        value: gameInstance?.getActiveConfig()?.seasonId ?? NO_SEASON_ID_TEXT,
      },
    ],
    [
      profile?.userTag,
      userId,
      streamState,
      streamId,
      channelId,
      groupName,
      groupID,
      gameInstance,
    ],
  );

  const matchInfoString = useMemo(() => {
    let matchInfoString = 'Match info\n';

    matchInfos.forEach((info) => {
      matchInfoString += '- ' + info.label + ': ';
      matchInfoString += info.value + '\n';
    });

    return matchInfoString;
  }, [matchInfos]);

  const toggleShowMatch = useCallback(() => setShowMatch((prev) => !prev), []);

  return { showMatch, matchInfos, toggleShowMatch, matchInfoString };
}
