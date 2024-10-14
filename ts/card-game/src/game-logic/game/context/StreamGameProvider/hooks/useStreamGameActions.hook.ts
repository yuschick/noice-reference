import { ApolloClient, NormalizedCacheObject, useApolloClient } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { useAuthentication } from '@noice-com/common-ui';
import { IMatchGroup, IMatchGroupDelegate } from '@noice-com/platform-client';
import { DebugMsgType } from '@noice-com/schemas/game-logic/game_logic.pb';
import { Nullable, makeLoggers } from '@noice-com/utils';
import { useCallback, useRef } from 'react';

// This is gross, but it is a temporary fix for the legacy game logic
// (Importing from the context is not possible due to circular dependencies)
import { useCardGameAPIInternal } from '../../../../../context/CardGameAPIProvider';
import { CardGame } from '../../../CardGame';

const { logError, logInfo } = makeLoggers('game-logic:game:useStreamGameActions');

export interface JoinGameOptions {
  isSolo?: boolean;
  forceGroupReset?: boolean;
}

export interface ChangeTeamOptions {
  isSolo?: boolean;
}

export interface LeaveGameOptions {
  forceGroupReset?: boolean;
}

type LeaveGroupOptions = LeaveGameOptions & { leavingMatch?: boolean };

type JoinActionTuple = [game: Nullable<CardGame>, error: Nullable<string>];
type ChangeActionTuple = [
  matchGroup: Nullable<IMatchGroup>,
  teamChangeAvailableAt: Nullable<string>,
  error: Nullable<string>,
];

export function useStreamGameActions() {
  const { hasRole, userId: localPlayerId } = useAuthentication();
  const client = useClient();
  const { emitAPIEvent } = useCardGameAPIInternal();
  const apollo = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const activeDelegates = useRef<IMatchGroupDelegate[]>([]);

  const leaveGroup = useCallback(
    async (options?: LeaveGroupOptions) => {
      const { forceGroupReset, leavingMatch = false } = options ?? {};

      try {
        const group = client.MatchService.getGroup();

        // no group to leave, return
        if (!group) {
          return;
        }

        // Reset delegates
        const delegates = activeDelegates.current.splice(0);
        delegates.forEach((delegate) => group.removeDelegate(delegate));

        if (forceGroupReset) {
          await client.MatchService.resetGroup();
        }

        // Actually close the game
        logInfo(`Leaving match group (leavingMatch=${leavingMatch})`);
        client.MatchService.enableReconnects = false;
        await client.MatchService.close(leavingMatch);
      } catch (e) {
        const err = e instanceof Error ? e : new Error(`${e}`);
        logError('Failed to leave game', err);
        return err.message;
      }
    },
    [client],
  );

  const leaveGame = useCallback(
    async (options?: LeaveGameOptions) => leaveGroup({ ...options, leavingMatch: true }),
    [leaveGroup],
  );

  const spectateGame = useCallback(
    async (streamId: string, groupId: string): Promise<JoinActionTuple> => {
      try {
        if (client.MatchService.getGroup()) {
          await leaveGroup();
        }

        if (!localPlayerId) {
          throw new Error('Local player ID is not set');
        }

        const gameInstance = new CardGame(localPlayerId, apollo);
        activeDelegates.current = [gameInstance.delegate];

        await client.MatchService.joinMatchGroup(
          streamId,
          groupId,
          activeDelegates.current,
          true,
        );
        logInfo(`Successfully joined group ${groupId}`);

        return [gameInstance, null];
      } catch (e) {
        const err = e instanceof Error ? e : new Error(`${e}`);
        logError('Failed to join game', err);
        return [null, err.message];
      }
    },
    [apollo, client, localPlayerId, leaveGroup],
  );

  const joinGame = useCallback(
    async (streamId: string, options?: JoinGameOptions): Promise<JoinActionTuple> => {
      const { forceGroupReset, isSolo } = options ?? {};

      try {
        if (client.MatchService.getGroup()) {
          if (client.MatchService.getStreamId() === streamId) {
            // If we are joining same stream,
            // we are just changing groups so we can leave the current group
            await leaveGroup({ forceGroupReset });
          } else {
            // otherwise we leave the game
            await leaveGame({ forceGroupReset });
          }
        }

        if (!localPlayerId) {
          throw new Error('Local player ID is not set');
        }

        const gameInstance = new CardGame(localPlayerId, apollo);
        activeDelegates.current = [gameInstance.delegate];

        logInfo(`Attempting to find match group (solo=${isSolo})`);
        client.MatchService.enableReconnects = true;
        const { groupId, teamChangeAvailableAt } =
          await client.MatchMakingService.findMatchGroup(streamId, isSolo);

        logInfo(`Trying to join group ${groupId}`);
        const matchGroup = await client.MatchService.joinMatchGroup(
          streamId,
          groupId,
          activeDelegates.current,
          false,
        );

        if (hasRole('admin')) {
          await matchGroup.setDebug(DebugMsgType.DEBUG_MSG_TYPE_ML_EVENTS, true);
        }

        gameInstance.setTeamChangeAvailableAt(teamChangeAvailableAt ?? null);
        logInfo(`Successfully joined group ${groupId}`);

        return [gameInstance, null];
      } catch (e) {
        const err = e instanceof Error ? e : new Error(`${e}`);
        logError('Failed to join game', err);
        return [null, err.message];
      }
    },
    [apollo, client, localPlayerId, leaveGame, leaveGroup, hasRole],
  );

  const changeTeam = useCallback(
    async (streamId: string, options?: ChangeTeamOptions): Promise<ChangeActionTuple> => {
      const { isSolo } = options ?? {};

      try {
        if (!client.MatchService.getGroup()) {
          throw new Error('Not in a match group');
        }

        logInfo(`Attempting to change team (streamId=${streamId}, solo=${isSolo})`);
        const { groupId: newGroupId, teamChangeAvailableAt } =
          await client.MatchMakingService.changeMatchGroup(streamId, isSolo);

        logInfo(`Trying to join group ${newGroupId}`);
        const matchGroup = await client.MatchService.joinMatchGroup(
          streamId,
          newGroupId,
          activeDelegates.current,
          false,
        );

        if (hasRole('admin')) {
          await matchGroup.setDebug(DebugMsgType.DEBUG_MSG_TYPE_ML_EVENTS, true);
        }

        return [matchGroup, teamChangeAvailableAt ?? null, null];
      } catch (e) {
        // If no vacant teams are available, this doesn't need to be an error.
        // Just emit the event and return null.
        // err code 9 = FAILED_PRECONDITION
        if (typeof e === 'object' && (e as { code?: number })?.code === 9) {
          await emitAPIEvent('onChangeTeamResultNoVacantTeams');
          return [null, null, null];
        }

        const err = typeof e === 'object' ? (e as Error) : new Error(`${e}`);
        logError('Failed to change team', e, JSON.stringify(err));
        return [null, null, err.message];
      }
    },
    [client, emitAPIEvent, hasRole],
  );

  return {
    joinGame,
    leaveGame,
    spectateGame,
    changeTeam,
  };
}
