import {
  ActiveCardSucceededMsg,
  HighScoringCardPromotedMsg,
  MatchEndedMsg,
  MatchPauseStateChangedMsg,
  MatchStartedMsg,
  PlayerJoinedMsg,
} from '@noice-com/schemas/game-logic/game_logic.pb';
import { StreamState } from '@noice-com/schemas/game-state/game_state.pb';
import { CameraTransitionRequestTransitionTarget } from '@noice-com/schemas/rendering/transitions.pb';
import {
  ActivateContextualTeamActionResponse,
  ChannelFollowed,
  routeStreamDiagnosticsUpdateContentDelegate,
  routeStreamEventContentDelegate,
  StreamDiagnosticsEvent,
  StreamerService as StreamerServicePb,
  SubscriptionGifted,
} from '@noice-com/schemas/streamer/streamer.pb';

import {
  SubService,
  IRequestParamsProvider,
  IStreamCancel,
  IStreamerServiceListener,
  IStreamerEvents,
  IStreamDiagnosticsUpdateListener,
} from './types';

export class StreamDiagnosticsState
  implements IStreamerEvents, IStreamDiagnosticsUpdateListener
{
  private _streamId: string;
  private _delegate: IStreamDiagnosticsUpdateListener;

  constructor(streamId: string, delegate: IStreamDiagnosticsUpdateListener) {
    this._streamId = streamId;
    this._delegate = delegate;
  }

  public getStreamId(): string {
    return this._streamId;
  }

  public onEnd(e?: Error): void {
    this._delegate.onEnd(e);
  }

  public onPing(_ctx: IStreamerEvents, _ev: number): void {
    console.log('Stream diagnostics ping');
  }

  public onEvent(_ctx: IStreamerEvents, ev: StreamDiagnosticsEvent): void {
    this._delegate.onEvent(this, ev);
  }
}
export class StreamerState implements IStreamerEvents, IStreamerServiceListener {
  private _streamId: string;
  private _delegate: IStreamerServiceListener;

  constructor(streamId: string, delegate: IStreamerServiceListener) {
    this._streamId = streamId;
    this._delegate = delegate;
  }

  public getStreamId(): string {
    return this._streamId;
  }

  public onEnd(e?: Error): void {
    this._delegate.onEnd(e);
  }

  // This is here just to keep the connection from timing out
  public onPing(_ctx: IStreamerEvents, _ev: number): void {
    console.log('Streamer ping');
  }

  public onGameCardSucceeded(_ctx: IStreamerEvents, ev: ActiveCardSucceededMsg): void {
    this._delegate.onGameCardSucceeded(this, ev);
  }

  public onHighScoringCardPromoted(
    ctx: IStreamerEvents,
    ev: HighScoringCardPromotedMsg,
  ): void {
    this._delegate.onHighScoringCardPromoted(ctx, ev);
  }

  public onMatchEnded(ctx: IStreamerEvents, ev: MatchEndedMsg): void {
    this._delegate.onMatchEnded(ctx, ev);
  }

  public onMatchStarted(ctx: IStreamerEvents, ev: MatchStartedMsg): void {
    this._delegate.onMatchStarted(ctx, ev);
  }

  public onPlayerJoined(ctx: IStreamerEvents, ev: PlayerJoinedMsg) {
    this._delegate.onPlayerJoined(ctx, ev);
  }

  public onChannelFollowed(ctx: IStreamerEvents, ev: ChannelFollowed) {
    this._delegate.onChannelFollowed(ctx, ev);
  }

  public onChannelSubscribed(ctx: IStreamerEvents, ev: ChannelFollowed) {
    this._delegate.onChannelSubscribed(ctx, ev);
  }

  public onSubscriptionGifted(ctx: IStreamerEvents, ev: SubscriptionGifted) {
    this._delegate.onSubscriptionGifted(ctx, ev);
  }

  public onStateUpdated(ctx: IStreamerEvents, ev: StreamState) {
    this._delegate.onStateUpdated(ctx, ev);
  }

  public onMatchPauseChange(ctx: IStreamerEvents, ev: MatchPauseStateChangedMsg): void {
    this._delegate.onMatchPauseChange(ctx, ev);
  }
}

export class StreamerService extends SubService {
  private _streamCancel?: IStreamCancel;
  private _streamDiagnosticsCancel?: IStreamCancel;
  private _pingReceived = -1;
  private _pingReceivedDiagnostics = -1;

  constructor(client: IRequestParamsProvider) {
    super(client);
    client.onClose(() => {
      this.close();
    });
  }

  public async activateContextualTeamAction(
    streamId: string,
  ): Promise<ActivateContextualTeamActionResponse> {
    const initReq = await this._getInitReq();
    const resp = await StreamerServicePb.ActivateContextualTeamAction(
      {
        streamId,
      },
      initReq,
    );

    return resp;
  }

  public async triggerCameraTransition(
    streamId: string,
    target: CameraTransitionRequestTransitionTarget,
  ): Promise<void> {
    const initReq = await this._getInitReq();
    await StreamerServicePb.TriggerCameraTransition(
      {
        streamId,
        cameraTransitionTarget: target,
      },
      initReq,
    );
  }

  public getStreamEvents(
    streamId: string,
    delegate: IStreamerServiceListener,
  ): IStreamCancel {
    this._pingReceived = -1;

    const abort = new AbortController();
    const streamerState = new StreamerState(streamId, delegate);

    const onEnd = (e?: Error) => {
      streamerState?.onEnd(e);
    };

    const cancelStream = () => {
      onEnd();
      abort.abort();
    };

    const promise = this._getInitReq().then((initReq) => {
      return StreamerServicePb.StreamEvents(
        { streamId },
        (resp) => {
          if (resp.ping) {
            this._pingReceived = resp.ping;
            return;
          }

          routeStreamEventContentDelegate<StreamerState>(
            streamerState,
            resp,
            streamerState,
          );
        },
        { ...initReq, signal: abort.signal },
      );
    });

    promise
      .then(() => onEnd())
      .catch((e: Error) => {
        onEnd(e);
      });

    this._streamCancel = cancelStream;
    return cancelStream;
  }

  public getStreamDiagnosticsEvents(
    streamId: string,
    delegate: IStreamDiagnosticsUpdateListener,
  ): IStreamCancel {
    this._pingReceivedDiagnostics = -1;

    const abort = new AbortController();
    const streamDiagnosticsState = new StreamDiagnosticsState(streamId, delegate);

    const onEnd = (e?: Error) => {
      streamDiagnosticsState?.onEnd(e);
    };

    const cancelStream = () => {
      onEnd();
      abort.abort();
    };

    const promise = this._getInitReq().then((initReq) => {
      return StreamerServicePb.StreamDiagnosticsUpdates(
        { streamId },
        (resp) => {
          if (resp.ping) {
            this._pingReceivedDiagnostics = resp.ping;
            return;
          }

          routeStreamDiagnosticsUpdateContentDelegate<StreamDiagnosticsState>(
            streamDiagnosticsState,
            resp,
            streamDiagnosticsState,
          );
        },
        { ...initReq, signal: abort.signal },
      );
    });

    promise
      .then(() => onEnd())
      .catch((e: Error) => {
        onEnd(e);
      });

    this._streamDiagnosticsCancel = cancelStream;
    return cancelStream;
  }

  public close(): void {
    this._streamCancel?.();
    this._streamDiagnosticsCancel?.();
  }
}
