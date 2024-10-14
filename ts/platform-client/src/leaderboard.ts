import {
  MatchServiceV2 as MatchServiceV2Pb,
  routeLeaderboardUpdateContentDelegate,
  LeaderboardUpdateReset,
  LeaderboardUpdatePlayerUpdate,
  LeaderboardUpdateGroupUpdate,
  LeaderboardUpdatePlayerLeft,
  ILeaderboardUpdateContentDelegate,
} from '@noice-com/schemas/match/match.pb';

import { logger } from './lib/logging';
import {
  IStreamCancel,
  SubService,
  ILeaderboardDelegate,
  IRequestParamsProvider,
  ILeaderboardGroup,
  ILeaderboardState,
  IStreamLeaderboard,
} from './types';

const log = logger('Leaderboard');

const sortDescending = (a: number, b: number) => -1 * (a - b);

export class StreamLeaderboard
  implements IStreamLeaderboard, ILeaderboardUpdateContentDelegate<StreamLeaderboard>
{
  private _state: ILeaderboardState;
  private _streamId: string;
  private _delegate: ILeaderboardDelegate;

  constructor(streamId: string, delegate: ILeaderboardDelegate) {
    this._delegate = delegate;
    this._streamId = streamId;
    this._state = {
      streamId,
      groups: new Map(),
    };
  }

  // This is here just to keep the connection from timing out
  public onPing(_: IStreamLeaderboard, _ev: number): void {
    log.debug('Leaderboard ping');
  }

  // IStreamLeaderboard
  public getGroup(groupId: string): ILeaderboardGroup | undefined {
    if (this._state.groups.has(groupId)) {
      return this._state.groups.get(groupId);
    }
  }

  public getState(): ILeaderboardState {
    return {
      streamId: this._streamId,
      groups: new Map(this._state.groups), // Duplicate so we don't get a ref
    };
  }

  public getLeaderboard(): ILeaderboardGroup[] {
    const groups = [...this._state.groups.values()];
    groups.sort((a, b) => sortDescending(a.points, b.points));
    return groups;
  }

  // ILeaderboardDelegate
  public reset(): void {
    this._state.groups.clear();
  }

  // Reset everything
  public onReset(_: IStreamLeaderboard, ev: LeaderboardUpdateReset): void {
    const groups: Map<string, ILeaderboardGroup> = new Map(this._state.groups);

    groups.forEach((group) => {
      group.points = 0;
      group.players = group.players.map((player) => ({
        ...player,
        points: 0,
      }));
    });

    this._state.groups = groups;
    this._delegate.onReset(this, ev);
  }

  public onPlayerLeft(_: IStreamLeaderboard, ev: LeaderboardUpdatePlayerLeft): void {
    if (this._state.groups.has(ev.groupId)) {
      const group = this._state.groups.get(ev.groupId);
      group.players = group.players.filter((player) => player.userId !== ev.userId);

      if (group.players.length === 0) {
        this._state.groups.delete(ev.groupId);
      }
    }

    this._delegate.onPlayerLeft(this, ev);
  }

  // Only used for initial connection
  public onGroupUpdate(_: IStreamLeaderboard, ev: LeaderboardUpdateGroupUpdate): void {
    this._state.groups.set(ev.id, {
      groupId: ev.id,
      groupName: ev.name,
      points: ev.points,
      players: ev.players.map((player) => ({
        userId: player.userId,
        points: player.points,
      })),
    });
    this._delegate.onGroupUpdate(this, ev);
  }

  // Whenever a player scores
  public onPlayerUpdate(_: IStreamLeaderboard, ev: LeaderboardUpdatePlayerUpdate): void {
    const group = this._state.groups.get(ev.groupId) ?? {
      groupId: ev.groupId,
      groupName: ev.groupName,
      points: 0,
      players: [],
    };

    const newGroup: ILeaderboardGroup = { ...group };

    // Update the players
    let playerExisted = false;

    // Update the player in-place if possible
    newGroup.players = group.players.map((player) => {
      const playerCopy = { ...player };

      // If the player exists, update their points in-place
      if (player.userId === ev.userId) {
        playerExisted = true;
        playerCopy.points = ev.points;
      }

      return playerCopy;
    });

    // If they didn't exist, push them into the group
    if (!playerExisted) {
      newGroup.players.push({
        userId: ev.userId,
        points: ev.points,
      });
    }

    // Update the group name
    newGroup.groupName = ev.groupName;
    // Sort by most points
    newGroup.points += ev.delta || 0;
    newGroup.players.sort((a, b) => sortDescending(a.points, b.points));

    // Update state + dispatch event to delegate
    this._state.groups.set(ev.groupId, newGroup);
    this._delegate.onPlayerUpdate(this, ev);
  }
}

export class LeaderboardService extends SubService {
  private _abortControllers: AbortController[] = [];

  constructor(client: IRequestParamsProvider) {
    super(client);
    client.onClose(() => {
      this.close();
    });
  }

  private async _connectLoop(
    leaderboard: StreamLeaderboard,
    streamId: string,
    abortSignal: AbortSignal,
  ): Promise<void> {
    let attemptsWithoutPing = 0;

    while (!abortSignal.aborted) {
      attemptsWithoutPing += 1;

      const initReq = await this._getInitReq();

      try {
        log.debug('connecting');
        await MatchServiceV2Pb.LeaderboardUpdates(
          { streamId },
          (resp) => {
            if (resp.ping) {
              attemptsWithoutPing = 0;
              return;
            }

            log.debug('update', resp);

            routeLeaderboardUpdateContentDelegate<StreamLeaderboard>(
              leaderboard,
              resp,
              leaderboard,
            );
          },
          { ...initReq, signal: abortSignal },
        );
      } catch (e) {
        if (e.name === 'AbortError') {
          return;
        }

        log.warn('error', e);
      }

      leaderboard.reset();

      const sleepMs = attemptsWithoutPing * 1000;
      log.debug(`reconnecting in ${sleepMs}ms`);

      await sleep(sleepMs);
    }

    return Promise.resolve();
  }

  public getStreamLeaderboards(
    streamId: string,
    delegate: ILeaderboardDelegate,
  ): IStreamCancel {
    const abort = new AbortController();
    const leaderboard = new StreamLeaderboard(streamId, delegate);

    this._abortControllers.push(abort);

    this._connectLoop(leaderboard, streamId, abort.signal)
      .then(() => {
        delegate.onEnd();
        return;
      })
      .finally(() => {
        const idx = this._abortControllers.indexOf(abort);

        if (idx !== -1) {
          this._abortControllers.splice(idx, 1);
        }
      })
      .catch((e) => {
        delegate.onEnd(e);
        return;
      });

    return () => {
      abort.abort();
    };
  }

  public close(): void {
    this._abortControllers.forEach((c) => c.abort());
    this._abortControllers = [];
  }
}

function sleep(time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}
