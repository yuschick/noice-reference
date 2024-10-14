import { StreamEntityPusher, StreamError } from '@noice-com/schemas/fetch.pb';
import { DebugMsgType } from '@noice-com/schemas/game-logic/game_logic.pb';
import { GroupRunnerState } from '@noice-com/schemas/game-state/game_state.pb';
import {
  MatchGroupAction,
  MatchGroupErrorCode,
  MatchGroupEvent,
  MatchMakingServiceV2 as MatchMakingServiceV2Pb,
  MatchServiceV2 as MatchServiceV2Pb,
  MatchAdminService as MatchAdminServicePb,
  MatchMakingAdminService as MatchMakingAdminServicePb,
  GetStreamStateResponse,
  StreamSpectatorCoordinationEvent,
  routeStreamSpectatorCoordinationEventEventDelegate,
  GetMatchStateResponse,
} from '@noice-com/schemas/match/match.pb';
import {
  ServerMessage,
  routeServerMessagePayloadDelegate,
} from '@noice-com/schemas/messaging/messaging.pb';

import { WSUtil, logger } from './lib';
import { getMatchErrorCode } from './lib/ws';
import {
  IClient,
  IMatchGroup,
  IMatchGroupDelegate,
  IMatchMakingService,
  IMatchService,
  IRequestParamsProvider,
  SubService,
  ConnectionStateInfo,
  ConnectionState,
  ConnectionErrorMsg,
  ISpectatorEventDelegate,
  MatchMakingResult,
} from './types';

const INITIAL_RETRY_BACKOFF = 500;

const log = logger('Match');

export class MatchMakingService extends SubService implements IMatchMakingService {
  constructor(client: IExtClient) {
    super(client);
  }

  public async findMatchGroup(
    streamId: string,
    solo = false,
  ): Promise<MatchMakingResult> {
    const resp = await MatchMakingServiceV2Pb.FindMatchGroup(
      {
        streamId,
        solo,
      },
      await this._getInitReq(),
    );

    return {
      groupId: resp.matchGroupId || '',
      teamChangeAvailableAt: resp.teamChangeAvailableAt,
    };
  }

  public async changeMatchGroup(
    streamId: string,
    solo = false,
  ): Promise<MatchMakingResult> {
    const resp = await MatchMakingServiceV2Pb.ChangeMatchGroup(
      {
        streamId,
        solo,
      },
      await this._getInitReq(),
    );

    return {
      groupId: resp.matchGroupId || '',
      teamChangeAvailableAt: resp.teamChangeAvailableAt,
    };
  }

  public async assignUserToGroup(
    streamId: string,
    groupId: string,
    userId: string,
  ): Promise<void> {
    await MatchMakingAdminServicePb.AssignMatchGroup(
      {
        streamId,
        groupId,
        userId,
      },
      await this._getInitReq(),
    );
  }
}

class MatchGroup implements IMatchGroup {
  public service: MatchService;

  public spectator = false;
  public delegates: IMatchGroupDelegate[] = [];
  public groupId: string;
  public localUserId: string;

  private _debugEventsActive: DebugMsgType[] = [];

  constructor(
    service: MatchService,
    groupId: string,
    spectator: boolean,
    delegates?: IMatchGroupDelegate[],
  ) {
    this.service = service;
    this.spectator = spectator;
    this.groupId = groupId;
    this.delegates = [];

    if (delegates) {
      delegates.forEach((delegate) => this.delegates.push(delegate));
    }

    const currSession = service.client.getSession();
    this.localUserId = currSession.auth.uid;

    // Finally let delegates know, that match group has been created
    if (delegates) {
      delegates.forEach((delegate) => delegate.initialized(this));
    }
  }

  public async leave(): Promise<void> {
    return await this.service.leaveActiveGroup();
  }

  public async cleanup(): Promise<void> {
    const activeDebugMsgs = [...this._debugEventsActive];
    const debugEventCancel = activeDebugMsgs.map((msgType) =>
      this.setDebug(msgType, false),
    );
    await Promise.all(debugEventCancel);
  }

  public removeDelegate(delegate: IMatchGroupDelegate): void {
    this.delegates = this.delegates.filter((del) => del !== delegate);
  }

  public async setActiveCard(cardId: string): Promise<void> {
    await this.service.sendAction({
      groupId: this.groupId,
      setActiveCard: {
        cardId,
      },
    });

    return;
  }

  public async shuffleHand(): Promise<void> {
    await this.service.sendAction({
      groupId: this.groupId,
      shuffleHand: {},
    });

    return;
  }

  public async triggerEmoji(emojiId: string): Promise<void> {
    await this.service.sendAction({
      groupId: this.groupId,
      triggerEmoji: {
        emojiId,
      },
    });

    return;
  }

  public async triggerEmote(emoteId: string): Promise<void> {
    await this.service.sendAction({
      groupId: this.groupId,
      triggerEmote: {
        emoteId,
      },
    });

    return;
  }

  public async useBooster(targetUserId: string, boosterId: number): Promise<void> {
    await this.service.sendAction({
      groupId: this.groupId,
      useBooster: {
        targetUserId,
        boosterId,
      },
    });

    return;
  }

  public async requestBooster(targetUserId: string, boosterId: number): Promise<void> {
    await this.service.sendAction({
      groupId: this.groupId,
      requestBooster: {
        targetUserId,
        boosterId,
      },
    });

    return;
  }

  public async cancelBoosterRequest(
    targetUserId: string,
    boosterId: number,
  ): Promise<void> {
    await this.service.sendAction({
      groupId: this.groupId,
      cancelBoosterRequest: {
        targetUserId,
        boosterId,
      },
    });

    return;
  }

  public async voteCard(targetUserId: string, cardId: string): Promise<void> {
    await this.service.sendAction({
      groupId: this.groupId,
      voteCard: {
        targetUserId,
        cardId,
      },
    });

    return;
  }

  public async cancelCardVote(targetUserId: string, cardId: string): Promise<void> {
    await this.service.sendAction({
      groupId: this.groupId,
      cancelCardVote: {
        targetUserId,
        cardId,
      },
    });

    return;
  }

  public async collectAONPoints(): Promise<void> {
    await this.service.sendAction({
      groupId: this.groupId,
      collectAonPoints: {},
    });

    return;
  }

  public async requestHand(): Promise<void> {
    await this.service.sendAction({
      groupId: this.groupId,
      requestHand: {},
    });

    return;
  }

  public async requestChallenges(): Promise<void> {
    await this.service.sendAction({
      requestAvailableChallenges: {},
    });

    return;
  }

  public async setActiveChallenge(challengeId: string): Promise<void> {
    await this.service.sendAction({
      setActiveChallenge: { challengeId },
    });

    return;
  }

  public async joinTeamAction(): Promise<void> {
    await this.service.sendAction({
      groupId: this.groupId,
      joinTeamAction: {},
    });

    return;
  }

  // This stores the active debug message types so that they can be cleaned up
  // when leaving/closing the connection.
  public async setDebug(
    msgType: DebugMsgType,
    enabled: boolean,
    jsonData?: string,
  ): Promise<void> {
    await this.service.sendAction({
      groupId: this.groupId,
      setDebug: {
        msgType,
        enabled,
        jsonData,
      },
    });

    if (!enabled) {
      this._debugEventsActive = this._debugEventsActive.filter(
        (aMsgType) => aMsgType !== msgType,
      );
      return;
    }

    if (!this._debugEventsActive.includes(msgType)) {
      this._debugEventsActive.push(msgType);
    }
  }

  public processEvent(ev: ServerMessage): void {
    this.delegates.forEach((delegate) =>
      routeServerMessagePayloadDelegate<IMatchGroup>(this, ev, delegate),
    );
  }
}

interface IExtClient extends IClient, IRequestParamsProvider {}

export class MatchService extends SubService implements IMatchService {
  public client: IClient;
  public enableReconnects = false;

  private _group: MatchGroup | null = null;
  private _streamId: string | null = null;
  private _callbacks: Map<number, (ev: MatchGroupEvent) => void> = new Map();
  private _matchGroupPusher: Promise<StreamEntityPusher<MatchGroupAction>> | null = null;
  private _abortController: AbortController | null = null;

  private _gotGroupMessage = false;
  private _reconnectInProgress = false;
  private _retryBackOff = INITIAL_RETRY_BACKOFF;
  private _cid = 0;

  constructor(client: IExtClient) {
    super(client);
    client.onClose((): void => {
      this.close(true);
    });
    this.client = client;
  }

  private _getRetryBackoff(): number {
    this._retryBackOff *= 2;
    return this._retryBackOff;
  }

  private async _getActiveGroupPusher(): Promise<StreamEntityPusher<MatchGroupAction> | null> {
    if (!this._matchGroupPusher) {
      return null;
    }

    return await this._matchGroupPusher;
  }

  private async _attemptReconnect(originalError: ConnectionErrorMsg) {
    if (!this.enableReconnects) {
      return;
    }

    try {
      this._reconnectInProgress = true;

      // Close the previous pusher (if active)
      const previousPusher = await this._getActiveGroupPusher();

      if (previousPusher) {
        previousPusher.close();
        this._matchGroupPusher = null;
      }

      // Let connections know we are reconnecting.
      this._reportConnectionStatus(ConnectionState.RECONNECTING, {
        error: originalError,
      });

      if (await this._establishConnection()) {
        if (!this._group) {
          throw new Error('Group missing during reconnect');
        }

        if (!this._streamId) {
          throw new Error('Stream missing during reconnect');
        }

        // Rejoin groups
        await this.sendAction({
          streamId: this._streamId,
          groupId: this._group.groupId,
          joinMatchGroup: {
            spectator: this._group.spectator,
          },
        });

        // Let connections know
        this._reportConnectionStatus(ConnectionState.CONNECTED);
        this._reconnectInProgress = false;
      } else {
        throw new Error('Reconnect failed');
      }
    } catch (e) {
      // Try again
      log.warn('Failed to reconnect', e);

      if (!this._gotGroupMessage) {
        setTimeout(() => {
          this._attemptReconnect(originalError);
        }, this._getRetryBackoff());
      } else {
        this._attemptReconnect(originalError);
      }
    }
  }

  private _reportConnectionStatus(
    state: ConnectionState,
    info?: ConnectionStateInfo,
  ): void {
    log.info(`Reporting connection status ${ConnectionState[state]} to all groups.`);
    this._group?.delegates.forEach((delegate) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      delegate.onConnectionStatusChanged(this._group!, {
        state,
        ...(info ? info : {}),
      }),
    );
  }

  private _onGroupEvent = (ev: MatchGroupEvent): void => {
    try {
      // Handle any errors.
      // @todo: rate limiting should probably be an error elsewhere, not in `MatchGroupErrorCode`.
      if (ev.error && ev.error.reason !== MatchGroupErrorCode.RATE_LIMIT_EXCEEDED) {
        const reason = ev.error.reason ?? MatchGroupErrorCode.UNSPECIFIED;
        this._onGroupError({
          streamClosed: false,
          code: getMatchErrorCode(reason),
          name: 'MatchGroupError',
          reason: reason,
          message: reason,
        });
      }

      // Handle any waiting callbacks.
      if (ev.cid) {
        const cb = this._callbacks.get(ev.cid);

        if (cb) {
          cb(ev);
        }

        this._callbacks.delete(ev.cid);
        return;
      }

      // Handle group specific events.
      if (ev?.groupId) {
        const groupId = ev.groupId;
        const group = this._group;
        this._gotGroupMessage = true;

        if (group && group.groupId === groupId) {
          ev?.event && group?.processEvent(ev.event);
        } else {
          log.warn('Received message for an unknown group', ev);
        }
      } else {
        log.warn('Unsupported event received', ev);
      }
    } catch (e) {
      log.warn('Caught error when parsing match service message:', e);
    }
  };

  private _onGroupError = (err: StreamError): void => {
    if (shouldRetryMatchMaking(err)) {
      // TODO inform the react side of the error
      this._group?.delegates.forEach((delegate) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        delegate.onRetryMatchMaking(this._group!),
      );
      return;
    }

    if (!err.streamClosed) {
      // TODO maybe display errors to the user
      return;
    }

    // Let all the group delegates know the connection is toast
    if (WSUtil.isNormalClosure(err.code)) {
      this._reportConnectionStatus(ConnectionState.DISCONNECTED, {
        closed: {
          code: err.code,
          reason: err.reason,
        },
      });
    } else {
      const errorMsg: ConnectionErrorMsg = {
        code: err.code,
        reason: err.message,
      };

      if (!this._reconnectInProgress) {
        this._attemptReconnect(errorMsg);
      }
    }
  };

  private async _establishConnection(): Promise<boolean> {
    // If we already have an active connection, just return true.
    if (this._matchGroupPusher !== null && (await this._getActiveGroupPusher())) {
      return true;
    }

    // Create an abort controller so we can abort if needed.
    if (!this._abortController) {
      this._abortController = new AbortController();
    }

    let pusher: StreamEntityPusher<MatchGroupAction> | null = null;

    try {
      this._gotGroupMessage = false;

      // Attempt top establish the connection
      this._matchGroupPusher = MatchServiceV2Pb.MatchGroup(
        this._onGroupEvent,
        this._onGroupError,
        {
          ...(await this._getInitReq()),
          signal: this._abortController.signal,
        },
      );

      // If it resolves to an instance of the pusher, we're connected
      pusher = await this._matchGroupPusher;

      if (pusher) {
        this._reconnectInProgress = false;
        return true;
      }
    } catch (e) {
      log.warn('Could not establish connection!', e);
      // Close the pusher if it is open (prevent hanging conne
      pusher?.close();
      this._matchGroupPusher = null;
    }

    return false;
  }

  public getGroup(): MatchGroup | null {
    return this._group;
  }

  public getStreamId(): string | null {
    return this._streamId;
  }

  public async sendAction(act: MatchGroupAction): Promise<MatchGroupEvent> {
    const pusher = await this._getActiveGroupPusher();

    if (!pusher) {
      this._reportConnectionStatus(ConnectionState.DISCONNECTED, {
        closed: {
          code: 0,
          reason: 'Connection not established',
        },
      });
      throw new Error('Connection not established');
    }

    return new Promise((resolve, reject) => {
      act.cid = ++this._cid;
      pusher.send(act);

      this._callbacks.set(act.cid, (ev: MatchGroupEvent) => {
        if (ev.error) {
          reject(ev.error.reason);
        } else {
          resolve(ev);
        }
      });
    });
  }

  public async joinMatchGroup(
    streamId: string,
    groupId: string,
    delegates?: IMatchGroupDelegate[],
    spectator = false,
    onMatchGroupInitialized?: (group: IMatchGroup) => void,
  ): Promise<IMatchGroup> {
    this._retryBackOff = INITIAL_RETRY_BACKOFF;

    if (!(await this._establishConnection())) {
      throw new Error('Connection not established');
    }

    // Handle if you are already connected to a group
    if (this._group) {
      // If it's the same group, just return the existing group
      if (groupId === this._group.groupId) {
        log.warn('Trying to join a match group that is already connected!');
        return this._group;
      }
    }

    // Otherwise create a new match group and store it
    const matchGroup = new MatchGroup(this, groupId, spectator, delegates);
    this._group = matchGroup;
    this._streamId = streamId;
    onMatchGroupInitialized?.(matchGroup);

    try {
      await this.sendAction({
        streamId,
        groupId,
        joinMatchGroup: {
          spectator,
        },
      });

      return matchGroup;
    } catch (e) {
      // Remove the group and surface the error
      log.warn('Could not connect to server', e);
      this._group = null;
      throw new Error(((e as { message: string }).message ?? e) as string);
    }
  }

  public async leaveActiveGroup(leavingMatch = false): Promise<void> {
    try {
      const group = this._group;

      if (!group) {
        return;
      }

      await group.cleanup();
      await this.sendAction({
        groupId: group.groupId,
        leaveMatchGroup: {
          leavingMatch,
        },
      });
      // Let delegates know
      (group.delegates ?? []).forEach((delegate) =>
        delegate.onConnectionStatusChanged(group, {
          state: ConnectionState.DISCONNECTED,
          closed: {
            reason: 'Left group',
            code: 1000,
          },
        }),
      );
      this._group = null;
    } catch (e) {
      log.warn('There was an error leaving the active match group:', e);
    }
  }

  public async getMatchState(streamId: string): Promise<GetMatchStateResponse> {
    const res = await MatchServiceV2Pb.GetMatchState(
      { streamId },
      await this._getInitReq(),
    );

    return res;
  }

  public async getStreamState(streamId: string): Promise<GetStreamStateResponse> {
    const res = await MatchAdminServicePb.GetStreamState(
      { streamId },
      await this._getInitReq(),
    );

    return res;
  }

  public async getGroupState(
    streamId: string,
    groupId: string,
  ): Promise<GroupRunnerState> {
    const res = await MatchAdminServicePb.GetGroupState(
      { streamId, groupId },
      await this._getInitReq(),
    );

    return res.runnerState;
  }

  public async advanceGroupTime(seconds: number): Promise<void> {
    if (!this._group) {
      return;
    }

    const groupId = this._group.groupId;
    const streamId = this._streamId;

    await MatchAdminServicePb.AdvanceGroupTime(
      { streamId, groupId, seconds },
      await this._getInitReq(),
    );
  }

  public async setGroupRandomSeed(seed: string): Promise<void> {
    if (!this._group) {
      return;
    }

    const groupId = this._group.groupId;
    const streamId = this._streamId;

    await MatchAdminServicePb.SetGroupRandomSeed(
      { streamId, groupId, seed },
      await this._getInitReq(),
    );
  }

  public consumeSpectatorCoordinationEvents(
    streamID: string,
    delegate: ISpectatorEventDelegate,
  ): () => void {
    const abortController = new AbortController();

    this._getInitReq()
      .then((initReq) => {
        return MatchServiceV2Pb.StreamSpectatorCoordinationEvents(
          { streamId: streamID },
          (ev: StreamSpectatorCoordinationEvent) => {
            routeStreamSpectatorCoordinationEventEventDelegate(streamID, ev, delegate);
          },
          {
            ...initReq,
            signal: abortController.signal,
          },
        );
      })
      .then(() => {
        delegate.onEnd(streamID, null);
        return;
      })
      .catch((e) => {
        delegate.onEnd(streamID, e);
      });

    return () => {
      abortController.abort();
    };
  }

  public async resetGroup(): Promise<void> {
    const currentPusher = await this._getActiveGroupPusher();
    if (currentPusher) {
      currentPusher.close();
    }
    this._matchGroupPusher = null;
    this._group = null;
  }

  public async close(leavingMatch?: boolean): Promise<void> {
    // If we are explicitly calling close, we dont want reconnects
    this.enableReconnects = false;

    const pusher = await this._matchGroupPusher;

    // If there is a pusher, close it and disconnect
    if (pusher) {
      await this.leaveActiveGroup(leavingMatch);
      pusher.close();
      this._matchGroupPusher = null;
    }

    // Abort any ongoing connections
    this._abortController?.abort();
    this._abortController = null;
  }
}

function shouldRetryMatchMaking(err: StreamError): boolean {
  return err.code === 5 || err.code === 7 || err.code === 9;
}
