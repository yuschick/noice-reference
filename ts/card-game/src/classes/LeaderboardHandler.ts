import {
  Client as NoiceClient,
  ILeaderboardDelegate,
  ILeaderboardGroup,
  IStreamCancel,
  IStreamLeaderboard,
} from '@noice-com/platform-client';
import {
  LeaderboardUpdateGroupUpdate,
  LeaderboardUpdatePlayerLeft,
  LeaderboardUpdatePlayerUpdate,
  LeaderboardUpdateReset,
} from '@noice-com/schemas/match/match.pb';
import { defaultQueue, SortUtils, makeLoggers } from '@noice-com/utils';

import { transformLeaderboardGroup } from '@game-transform';
import { LeaderboardGroup, LeaderboardGroupmember } from '@game-types';

const { logError } = makeLoggers('LeaderboardHandler');

type RankDictionary = {
  [groupId: string]: number;
};

interface LeaderboardChangedGroup {
  groupId: string;
  oldRank: number;
  newRank: number;
}

interface LeaderboardResetMessage {
  streamId: string;
  groups: LeaderboardGroup[];
  players: Record<string, LeaderboardGroupmember>;
}

interface LeaderboardGroupUpdateMessage {
  streamId: string;
  groups: LeaderboardGroup[];
  players: Record<string, LeaderboardGroupmember>;
  updatedGroupId: string;
  affectedGroups: LeaderboardChangedGroup[]; // Groups losing rank as a result
}

interface LeaderboardPlayerLeftMessage {
  streamId: string;
  groups: LeaderboardGroup[];
  players: Record<string, LeaderboardGroupmember>;
  removedPlayerId: string;
  affectedGroupId: string;
}

interface LeaderboardPlayerUpdateMessage {
  streamId: string;
  groups: LeaderboardGroup[];
  players: Record<string, LeaderboardGroupmember>;
  updatedPlayerId: string;
  updatedGroupId: string; // Players group
  affectedGroups: LeaderboardChangedGroup[]; // Groups losing rank as a result
}

export interface LeaderboardListener {
  onReset?: (msg: LeaderboardResetMessage) => void;
  onGroupUpdate?: (msg: LeaderboardGroupUpdateMessage) => void;
  onPlayerUpdate?: (msg: LeaderboardPlayerUpdateMessage) => void;
  onPlayerLeft?: (msg: LeaderboardPlayerLeftMessage) => void;
  onEnd?: (err: Error) => void;
}

export class LeaderboardHandler implements ILeaderboardDelegate {
  public readonly streamId: string;
  private _active = false;
  private _listeners: LeaderboardListener[];
  private _currentGroups: RankDictionary = {};
  private _cancel?: IStreamCancel;
  private _context?: IStreamLeaderboard;

  public get active() {
    return this._active;
  }

  public get currentState() {
    if (!this._context) {
      return;
    }

    const leaderboard = this._context.getLeaderboard();

    return this._getLeaderboardGroupsAndPlayers(leaderboard);
  }

  constructor(streamId: string) {
    this.streamId = streamId;
    this._listeners = [];
  }

  private _getLeaderboardGroupsAndPlayers = (leaderboard: ILeaderboardGroup[]) => {
    type GroupsAndPlayers = {
      groups: LeaderboardGroup[];
      players: Record<string, LeaderboardGroupmember>;
    };

    const groupsWithPlayers = leaderboard.filter((group) => group.players.length > 0);

    return groupsWithPlayers.reduce(
      (acc, group, newRank) => {
        const transformedGroup = transformLeaderboardGroup(group, newRank + 1);

        acc.groups.push(transformedGroup);

        transformedGroup.players.forEach((player) => {
          acc.players[player.playerId] = player;
        });

        return acc;
      },
      { groups: [], players: {} } as GroupsAndPlayers,
    );
  };

  private _getSortedGroups = (groups: ILeaderboardGroup[]) => {
    const copy = [...groups];
    copy.sort((a, b) => SortUtils.sortDescending(a.points, b.points));
    return copy;
  };

  private _getRankDiff = (
    oldRanks: RankDictionary,
    newLeaderboard: ILeaderboardGroup[],
  ): [RankDictionary, LeaderboardChangedGroup[]] => {
    const prev: RankDictionary = { ...oldRanks };
    const next: RankDictionary = { ...oldRanks };
    const affectedGroups: LeaderboardChangedGroup[] = [];

    const groupsWithPlayers = newLeaderboard.filter((group) => group.players.length > 0);

    groupsWithPlayers.forEach(({ groupId }, index) => {
      const newRank = index + 1;
      const oldRank = prev[groupId] ?? -1;

      if (oldRank !== newRank) {
        affectedGroups.push({
          groupId,
          oldRank,
          newRank,
        });
      }

      next[groupId] = newRank;
    });

    return [next, affectedGroups];
  };

  private _dispatchMessage = <P extends keyof LeaderboardListener>(
    event: P,
    message: Parameters<Required<LeaderboardListener>[P]>[0],
  ) => {
    // Make a copy in case something removes itself.
    const listeners = [...this._listeners];
    listeners.forEach((listener) => {
      if (listener[event]) {
        // We know it exists, type and call.
        const handler = listener[event] as (msg: typeof message) => void;
        defaultQueue.enqueueHandler(async () => await handler(message));
      }
    });
  };

  public connect(client: NoiceClient) {
    this._cancel = client.LeaderboardService.getStreamLeaderboards(this.streamId, this);
    this._active = true;
    this._currentGroups = {};
  }

  public disconnect() {
    this._cancel?.();
    this._active = false;
    this._currentGroups = {};
  }

  public addEventListener(delegate: LeaderboardListener) {
    const listeners = [...this._listeners, delegate];
    this._listeners = listeners;

    return () => {
      const filtered = this._listeners.filter((del) => del !== delegate);
      this._listeners = filtered;
    };
  }

  public onPing(_: IStreamLeaderboard, _ev: number) {
    // Unused
  }

  public onEnd(err?: Error) {
    if (err) {
      logError('Leaderboard connection terminated due to error:', err);
    }

    this._active = false;
  }

  // This gets called at first connect + in between matches
  public onReset(ctx: IStreamLeaderboard, _: LeaderboardUpdateReset) {
    this._context = ctx;

    // Transform + cache ranks
    const state = this._context.getState();
    const players: Record<string, LeaderboardGroupmember> = {};
    const groupWithPlayers = this._getSortedGroups([...state.groups.values()]).filter(
      (group) => group.players.length > 0,
    );
    const groups = groupWithPlayers.map((group, idx) => {
      const rank = idx + 1;
      this._currentGroups[group.groupId] = rank;

      const transformedGroup = transformLeaderboardGroup(group, rank);
      transformedGroup.players.forEach((player) => {
        players[player.playerId] = player;
      });

      return transformedGroup;
    });

    // Dispatch
    this._dispatchMessage('onReset', {
      streamId: state.streamId,
      groups,
      players,
    });
  }

  // This gets called when someone leaves
  public onPlayerLeft(ctx: IStreamLeaderboard, ev: LeaderboardUpdatePlayerLeft) {
    this._context = ctx;
    const state = this._context.getState();

    const newLeaderboard = this._context.getLeaderboard();
    this._dispatchMessage('onPlayerLeft', {
      streamId: state.streamId,
      removedPlayerId: ev.userId ?? 'Missing player ID',
      affectedGroupId: ev.groupId ?? 'Missing group ID',
      ...this._getLeaderboardGroupsAndPlayers(newLeaderboard),
    });
  }

  // This gets called ONLY when first connecting to give us initial state
  public onGroupUpdate(ctx: IStreamLeaderboard, ev: LeaderboardUpdateGroupUpdate) {
    this._context = ctx;
    const state = this._context.getState();

    const newLeaderboard = this._context.getLeaderboard();
    const [newRanks, affectedGroups] = this._getRankDiff(
      this._currentGroups,
      newLeaderboard,
    );

    this._currentGroups = newRanks;
    this._dispatchMessage('onGroupUpdate', {
      streamId: state.streamId,
      updatedGroupId: ev.id ?? 'missing-id',
      affectedGroups,
      ...this._getLeaderboardGroupsAndPlayers(newLeaderboard),
    });
  }

  // This gets called whenever someone scores any points
  public onPlayerUpdate(ctx: IStreamLeaderboard, ev: LeaderboardUpdatePlayerUpdate) {
    this._context = ctx;
    const state = this._context.getState();

    const newLeaderboard = this._context.getLeaderboard();
    const [newRanks, affectedGroups] = this._getRankDiff(
      this._currentGroups,
      newLeaderboard,
    );

    this._currentGroups = newRanks;
    this._dispatchMessage('onPlayerUpdate', {
      streamId: state.streamId,
      updatedPlayerId: ev.userId ?? 'missing-player-id',
      updatedGroupId: ev.groupId ?? 'missing-group-id',
      affectedGroups,
      ...this._getLeaderboardGroupsAndPlayers(newLeaderboard),
    });
  }
}
