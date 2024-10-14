import { StreamEntityPusher } from '@noice-com/schemas/fetch.pb';
import {
  routeWatchEventEventDelegate,
  ICEServer,
  IceTransportPolicy,
  QualityLayer,
  StreamEgressService,
  StreamPlacement,
  StreamType,
  TrackInfo,
  WatchAction,
  WatchActionProgressUpdateState,
  WatchActionSelectGroup,
  WatchActionStop,
  WatchActionWatch,
  WatchEvent,
  WatchEventAnswer,
  WatchEventAvatarPlacement,
  WatchEventAvatarRemoval,
  WatchEventError,
  WatchEventICECandidate,
  WatchEventInitPeerConnection,
  WatchEventKeyValueOp,
  WatchEventOffer,
  WatchEventQualityLayerSelected,
  WatchEventServerShuttingDown,
  WatchEventSignal,
} from '@noice-com/schemas/stream/egress.pb';
import { StreamMetricsMetadata } from 'lib/ts/gen/schemas/analytics/analytics.pb';

import { logger } from '../lib/logging';
import {
  AnalyticsPayload,
  IStreamingDelegate,
  IStreamingService,
  IWatchSession,
  SubService,
  WatchParams,
} from '../types';

import { getFullSessionMetrics, getSampleMetrics } from './metric-events';
import { StatsCollector } from './stats';
import { isAudioTrackStats, isVideoTrackStats, StatsEvent } from './types';

const log = logger('STREAMING');

const ICE_GATHERING_TIMEOUT = 2000;

export interface IStreamingSession {
  id: string;
  delegate: IStreamingDelegate;

  watch(streamId: string, streamType: StreamType): void;
  selectGroup(groupId: string): void;
  onInitPeerConnection(event: WatchEventInitPeerConnection): void;
  onOffer(offer: WatchEventOffer): Promise<void>;
  onAnswer(answer: WatchEventAnswer): Promise<void>;
  onIceCandidate(candidate: WatchEventICECandidate): Promise<void>;
  selectQualityLayer(layer: QualityLayer): Promise<void>;
  signalFirstFrame(): Promise<void>;

  stopWithError(err: Error): void;
  close(): void;
}

interface MediaStreamContainer {
  stream: MediaStream;
  expectedTracks: TrackInfo[];
}

// @todo, matti: It might be wise to remove all of the active listeners on the connection when we close it
// BUT I don't really know if we re-use sessions somehow, so I will leave it for another time. It shouldn't
// be that big of a deal but, something to think about
class Session implements IStreamingSession {
  public id: string;
  public delegate: IStreamingDelegate;

  private serv: StreamingConnection;
  private peerConnection: RTCPeerConnection;
  private mediaStreams: Map<string, MediaStreamContainer>;
  private abortController: AbortController;
  private stopped = false;

  private layeredTrackId: string;

  private iceGatheringTimeout: ReturnType<typeof setTimeout> | undefined;
  private offerSent = false;

  private egressType: string;
  private livepeerUrl: string;
  private channelId: string;
  private streamId: string;
  private streamType: StreamType;
  private statsCollector: StatsCollector;
  private statsCollectorListenerCleanup: () => void;
  private sendAnalyticsEvent: (payload: AnalyticsPayload) => void;
  private placement: StreamPlacement;

  private startTime: number;

  constructor(
    id: string,
    delegate: IStreamingDelegate,
    serv: StreamingConnection,
    sendAnalyticsEvent: (payload: AnalyticsPayload) => void,
    placement: StreamPlacement,
  ) {
    this.id = id;
    this.delegate = delegate;
    this.serv = serv;
    this.abortController = new AbortController();
    this.mediaStreams = new Map();
    this.statsCollector = new StatsCollector({
      interval: 1000 * 30,
    });
    this.statsCollectorListenerCleanup = this.statsCollector.addListener(
      (ev: StatsEvent) => {
        this.sendMetrics(ev, false);
      },
    );
    this.sendAnalyticsEvent = sendAnalyticsEvent;
    this.placement = placement;
    this.startTime = performance.now();
  }

  private async sendAction(act: WatchAction, timeout?: number): Promise<WatchEvent> {
    act.sessionId = this.id;

    return await this.serv.sendAction(act, timeout);
  }

  private async stop(err: Error): Promise<void> {
    if (!this.stopped) {
      this.stopped = true;

      this.abortController.abort();

      const totalsListenerCleanup = this.statsCollector.addListener((ev: StatsEvent) => {
        this.sendMetrics(ev, true);
      });

      if (this.peerConnection) {
        await this.statsCollector.stop();
        this.statsCollector.removeConnection({ conn: this.peerConnection });
        this.peerConnection.close();
        this.peerConnection = null;
      }

      const act: WatchActionStop = {};

      if (err) {
        act.error = err.message;
      }
      this.statsCollectorListenerCleanup();
      totalsListenerCleanup();

      try {
        await this.sendAction(
          {
            stop: act,
          },
          1000,
        );
      } finally {
        this.serv.closeSession(this.id);
      }
    }
  }

  private async onTrack(event: RTCTrackEvent): Promise<void> {
    const track = event.track;
    const mid = event.transceiver.mid;

    let streamContainer: MediaStreamContainer;
    for (const container of this.mediaStreams.values()) {
      for (const track of container.expectedTracks) {
        if (track.mid === mid) {
          streamContainer = container;
        }
      }
    }

    if (!streamContainer) {
      log.error(`mediastream for track does not exist`);
      throw new Error('mediastream for the track does not exist');
    }

    streamContainer.stream.addTrack(track);

    if (
      streamContainer.expectedTracks.length === streamContainer.stream.getTracks().length
    ) {
      const layeredTrack = streamContainer.expectedTracks.find(
        (track) => track.qualityLayers && track.qualityLayers.length > 0,
      );
      let qualityLayers: QualityLayer[] = [];
      if (layeredTrack) {
        this.layeredTrackId = layeredTrack.id;
        qualityLayers = layeredTrack.qualityLayers;
      }
      this.delegate.onMediaStream(this, streamContainer.stream, qualityLayers);
      await this.sendAction({
        progressUpdate: {
          state: WatchActionProgressUpdateState.STATE_MEDIA_STREAM_CREATED,
          duration: performance.now() - this.startTime,
        },
      });
    }
  }

  private async sendOffer(resolvedUrl: string): Promise<void> {
    this.offerSent = true;
    await this.sendAction({
      offer: {
        sdp: this.peerConnection.localDescription.sdp,
        resolvedUrl: resolvedUrl,
      },
    });
  }

  private async sendMetrics(ev: StatsEvent, sendTotals: boolean) {
    for (const [_, connStats] of Object.entries(ev.connections)) {
      const metadata: StreamMetricsMetadata = {
        streamId: this.streamId,
        channelId: this.channelId,
        streamType: this.streamType,
        egressType: connStats.egressType,
        sessionId: this.id,
      };

      const audio = Object.values(connStats.tracks).find(
        (track) => track.kind === 'audio',
      );

      const video = Object.values(connStats.tracks).find(
        (track) => track.kind === 'video',
      );

      if (!isAudioTrackStats(audio) || !isVideoTrackStats(video)) {
        continue;
      }

      if (sendTotals) {
        this.sendAnalyticsEvent({
          clientWebrtcMetricsTotal: {
            metadata,
            metrics: getFullSessionMetrics(connStats, audio, video),
          },
        });
      } else {
        this.sendAnalyticsEvent({
          clientWebrtcMetricsSample: {
            metadata,
            metrics: getSampleMetrics(connStats, audio, video),
          },
        });
      }
    }
  }

  public close() {
    this.stopWithError(undefined);
  }

  public stopWithError(err: Error): void {
    if (!this.stopped) {
      this.stop(err);
      this.delegate.onEnd(this, err);
    }
  }

  public async watch(streamId: string, streamType: StreamType): Promise<void> {
    const act: WatchActionWatch = {
      streamId: streamId,
      streamType: streamType,
      streamPlacement: this.placement,
    };
    this.streamId = streamId;
    this.streamType = streamType;
    try {
      await this.sendAction({
        watch: act,
      });
    } catch (e) {
      this.stopWithError(e);
    }
  }

  public async selectGroup(groupId: string): Promise<void> {
    const act: WatchActionSelectGroup = {
      groupId: groupId,
    };
    try {
      await this.sendAction({
        selectGroup: act,
      });
    } catch (e) {
      this.stopWithError(e);
    }
  }

  public async onInitPeerConnection(event: WatchEventInitPeerConnection): Promise<void> {
    if (this.stopped) {
      return;
    }

    this.egressType = event.egressType;
    this.channelId = event.channelId;

    try {
      let resolvedUrl = '';
      if (this.egressType === 'livepeer') {
        resolvedUrl = await resolveLivepeerUrl(event.rawUrl);
        const parsedUrl = new URL(resolvedUrl);
        event.iceServers = [
          {
            urls: [`stun:${parsedUrl.hostname}`],
          },
          {
            urls: [`turn:${parsedUrl.hostname}`],
            credential: 'livepeer',
            username: 'livepeer',
          },
        ];
        this.livepeerUrl = resolvedUrl;
      }

      log.info(`starting streaming session`, this.egressType);

      let iceTransportPolicy: RTCIceTransportPolicy = 'all';

      if (event.transportPolicy === IceTransportPolicy.ICE_TRANSPORT_POLICY_ALL) {
        iceTransportPolicy = 'all';
      } else if (
        event.transportPolicy === IceTransportPolicy.ICE_TRANSPORT_POLICY_RELAY
      ) {
        iceTransportPolicy = 'relay';
      }

      this.peerConnection = new RTCPeerConnection({
        iceServers: transformIceServers(event.iceServers),
        iceTransportPolicy: iceTransportPolicy,
      });

      this.statsCollector.addConnection({
        id: this.id,
        egressType: this.egressType,
        conn: this.peerConnection,
      });

      this.peerConnection.addEventListener('track', (event: RTCTrackEvent) => {
        this.onTrack(event);
      });

      const stateChangeCallback = () => {
        this.delegate.onConnectionStateChange(
          this.peerConnection.iceConnectionState,
          this.peerConnection.iceGatheringState,
          this.egressType,
          this.livepeerUrl,
        );
      };

      this.peerConnection.addEventListener('iceconnectionstatechange', async () => {
        if (this.peerConnection.iceConnectionState === 'connected') {
          await this.sendAction({
            progressUpdate: {
              state: WatchActionProgressUpdateState.STATE_ICE_CONNECTED,
              duration: performance.now() - this.startTime,
            },
          });
        }
        stateChangeCallback();
      });

      if (event.clientSendsOffer) {
        clearTimeout(this.iceGatheringTimeout);
        this.peerConnection.addEventListener(
          'icegatheringstatechange',
          async (_: Event) => {
            if (this.peerConnection.iceGatheringState === 'complete' && !this.offerSent) {
              await this.sendOffer(resolvedUrl);
            }
            stateChangeCallback();
          },
        );

        // We need to set local offer first to start the ICE gathering
        this.peerConnection.addTransceiver('video', { direction: 'recvonly' });
        this.peerConnection.addTransceiver('audio', { direction: 'recvonly' });
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);

        this.iceGatheringTimeout = setTimeout(async () => {
          if (!this.offerSent) {
            await this.sendOffer(resolvedUrl);
          }
        }, ICE_GATHERING_TIMEOUT);
      } else {
        this.peerConnection.addEventListener(
          'icegatheringstatechange',
          stateChangeCallback,
        );
        this.peerConnection.addEventListener(
          'icecandidate',
          async (event: RTCPeerConnectionIceEvent) => {
            if (event.candidate) {
              await this.sendAction({
                candidate: {
                  candidate: JSON.stringify(event.candidate),
                },
              });
            }
          },
        );
      }
      await this.sendAction({
        progressUpdate: {
          state: WatchActionProgressUpdateState.STATE_PEER_CONNECTION_CREATED,
          duration: performance.now() - this.startTime,
        },
      });
    } catch (e) {
      this.stopWithError(e);
    }
  }

  public async onAnswer(answer: WatchEventAnswer): Promise<void> {
    if (this.stopped) {
      return;
    }

    try {
      if (!this.peerConnection) {
        log.error(`peer connection does not exist before first answer`);
        throw new Error('onanswer: peer connection does not exist');
      }

      for (const stream of answer.streams) {
        this.mediaStreams.set(stream.label, {
          stream: new MediaStream(),
          expectedTracks: stream.tracks,
        });
      }

      await this.peerConnection.setRemoteDescription({
        type: 'answer',
        sdp: answer.sdp,
      });

      await this.sendAction({
        progressUpdate: {
          state: WatchActionProgressUpdateState.STATE_SIGNALING_COMPLETE,
          duration: performance.now() - this.startTime,
        },
      });
    } catch (e) {
      this.stopWithError(e);
    }
  }

  public async onOffer(offer: WatchEventOffer): Promise<void> {
    if (this.stopped) {
      return;
    }

    try {
      if (!this.peerConnection) {
        log.error(`peer connection does not exist before first offer`);
        throw new Error('onoffer: peer connection does not exist');
      }

      for (const stream of offer.streams) {
        this.mediaStreams.set(stream.label, {
          stream: new MediaStream(),
          expectedTracks: stream.tracks,
        });
      }

      const stereo = isJSEPSDPStereo(offer.jsepSdpOffer);

      await this.peerConnection.setRemoteDescription({
        type: 'offer',
        sdp: offer.jsepSdpOffer,
      });

      const answer = await this.peerConnection.createAnswer();
      let answerSdp = answer.sdp;

      if (stereo && !isJSEPSDPStereo(answerSdp)) {
        answerSdp = addJSEPSDPStereo(answerSdp);
      }

      await this.peerConnection.setLocalDescription({
        type: 'answer',
        sdp: answerSdp,
      });

      await this.sendAction({
        start: {
          offerId: offer.id,
          jsepSdpAnwser: answerSdp,
        },
      });

      await this.sendAction({
        progressUpdate: {
          state: WatchActionProgressUpdateState.STATE_SIGNALING_COMPLETE,
          duration: performance.now() - this.startTime,
        },
      });
    } catch (e) {
      this.stopWithError(e);
    }
  }

  public async onIceCandidate(ev: WatchEventICECandidate): Promise<void> {
    if (this.stopped) {
      return;
    }

    const candidate = JSON.parse(ev.candidate);

    if (this.peerConnection) {
      await this.peerConnection.addIceCandidate(candidate);
    }
  }

  public selectQualityLayer = async (layer: QualityLayer): Promise<void> => {
    await this.sendAction({
      selectQualityLayer: {
        trackId: this.layeredTrackId,
        layer: layer,
      },
    });
  };

  public signalFirstFrame = async (): Promise<void> => {
    await this.sendAction({
      progressUpdate: {
        state: WatchActionProgressUpdateState.STATE_FIRST_FRAME_RENDERED,
        duration: performance.now() - this.startTime,
      },
    });
  };
}

class StreamingConnection extends SubService {
  private _pusher: Promise<StreamEntityPusher<WatchAction>>;
  private _abortController: AbortController;
  private _callbacks: Map<number, (ev: WatchEvent) => void> = new Map();
  private _sessions: Map<string, IStreamingSession> = new Map();
  private _cid = 0;

  private _healthy = true;

  private async _closeConn() {
    this._cleanSessions();

    if (this._abortController) {
      this._abortController.abort();
      this._abortController = null;
    }

    if (this._pusher) {
      (await this._pusher).close();
      this._pusher = null;
    }
  }

  private _cleanSessions(): void {
    for (const session of this._sessions.values()) {
      session.close();
    }

    this._sessions.clear();
  }

  public closeSession(id: string): void {
    this._sessions.delete(id);

    if (this._sessions.size === 0) {
      this._healthy = false;
      this._closeConn();
    }
  }

  public isHealthy(): boolean {
    return this._healthy;
  }

  public establishConnection(): Promise<void> {
    if (this._pusher) {
      return;
    }

    this._abortController = new AbortController();
    this._pusher = this._getInitReq().then((initReq) => {
      return StreamEgressService.Watch(
        (ev: WatchEvent) => {
          if (ev.cid) {
            const cb = this._callbacks.get(ev.cid);

            if (cb) {
              cb(ev);
            }

            this._callbacks.delete(ev.cid);
            return;
          }

          const session = this._sessions.get(ev.sessionId);

          routeWatchEventEventDelegate(undefined, ev, {
            onInitPeerConnection: (_, ev: WatchEventInitPeerConnection) => {
              session?.onInitPeerConnection(ev);
            },
            onOffer: (_, ev: WatchEventOffer) => {
              session?.onOffer(ev);
            },
            onAnswer: (_, ev: WatchEventAnswer) => {
              session?.onAnswer(ev);
            },
            onError: (_, ev: WatchEventError) => {
              if (session) {
                session.stopWithError(new Error(ev.message));
              } else {
                for (const [_, session] of this._sessions) {
                  session.stopWithError(new Error(ev.message));
                }
              }
            },
            onKeyValueOp: (_, ev: WatchEventKeyValueOp) => {
              session?.delegate.onKeyValueOp(session, ev);
            },
            onSignal: (_, ev: WatchEventSignal) => {
              session?.delegate.onSignal(session, ev);
            },
            onAck: () => {
              // No-op
            },
            onAvatarPlacement: (_, ev: WatchEventAvatarPlacement) => {
              session?.delegate.onAvatarPlacement(session, ev);
            },
            onAvatarRemoval: (_, ev: WatchEventAvatarRemoval) => {
              session?.delegate.onAvatarRemoval(session, ev);
            },
            onServerShuttingDown: (_, _ev: WatchEventServerShuttingDown) => {
              if (!this._healthy) {
                return;
              }

              this._healthy = false;

              for (const [_, session] of this._sessions) {
                session.delegate.onServerShuttingDown(session, ev);
              }
            },
            onIceCandidate: (_, ev: WatchEventICECandidate) => {
              session?.onIceCandidate(ev);
            },
            onQualityLayerSelected: (_, _ev: WatchEventQualityLayerSelected) => {
              // No-op for now
            },
          });
        },
        (err: Error) => {
          this._healthy = false;

          for (const session of this._sessions.values()) {
            session.stopWithError(err);
          }
        },
        {
          ...initReq,
          signal: this._abortController.signal,
          shutdownCallback: () => {
            if (!this._healthy) {
              return;
            }

            this._healthy = false;

            for (const [_, session] of this._sessions) {
              session.delegate.onServerShuttingDown(session, {});
            }
          },
        },
      );
    });
  }
  public async sendAction(act: WatchAction, timeout?: number): Promise<WatchEvent> {
    const pusher = await this._pusher;

    if (!pusher) {
      throw new Error('connection not established');
    }

    return new Promise((resolve, reject) => {
      act.cid = ++this._cid;

      if (!this._pusher) {
        throw new Error('connection not yet established');
      }

      pusher.send(act);

      let returned = false;

      if (timeout) {
        setTimeout(() => {
          if (!returned) {
            returned = true;
            reject(new Error('timeout'));
          }
        }, timeout);
      }

      this._callbacks.set(act.cid, (ev: WatchEvent) => {
        if (returned) {
          return;
        }

        returned = true;

        if (ev.error) {
          reject(new Error(ev.error.message));
        } else {
          resolve(ev);
        }
      });
    });
  }

  public createSession(
    streamID: string,
    params: WatchParams,
    delegate: IStreamingDelegate,
    sendAnalyticsEvent: (payload: AnalyticsPayload) => void,
    placement: StreamPlacement,
  ): IStreamingSession {
    const sessionID = generateRandomStreamID();

    const session = new Session(sessionID, delegate, this, sendAnalyticsEvent, placement);

    this._sessions.set(sessionID, session);

    const streamType = params.raw
      ? StreamType.STREAM_TYPE_SOURCE
      : StreamType.STREAM_TYPE_CR;

    session.watch(streamID, streamType);

    return session;
  }
}

export class StreamingService extends SubService implements IStreamingService {
  private _connection: StreamingConnection;

  private _ensureConnection(): StreamingConnection {
    if (this._connection && this._connection.isHealthy()) {
      return this._connection;
    }

    this._connection = new StreamingConnection(this._getParamsProvider());
    this._connection.establishConnection();
    return this._connection;
  }

  public watch(
    streamID: string,
    params: WatchParams,
    delegate: IStreamingDelegate,
    sendAnalyticsEvent: (payload: AnalyticsPayload) => void,
    placement: StreamPlacement,
  ): IWatchSession {
    const conn = this._ensureConnection();

    return conn.createSession(streamID, params, delegate, sendAnalyticsEvent, placement);
  }
}

function generateRandomStreamID(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function isJSEPSDPStereo(jsepSDP?: string): boolean {
  if (!jsepSDP) {
    return false;
  }

  return jsepSDP.indexOf('stereo=1') > -1;
}

function addJSEPSDPStereo(jsepSDP: string): string {
  if (isJSEPSDPStereo(jsepSDP)) {
    return jsepSDP;
  }

  return jsepSDP.replace('useinbandfec=1', 'useinbandfec=1;stereo=1');
}

function transformIceServers(servers: ICEServer[]): RTCIceServer[] {
  return servers.map((server) => {
    return {
      urls: server.urls ?? [],
      username: server.username,
      credential: server.credential,
    };
  });
}

async function resolveLivepeerUrl(rawUrl: string): Promise<string> {
  const response = await fetch(rawUrl, {
    method: 'HEAD',
  });
  if (!response.ok) {
    throw new Error('Failed to get redirect URL');
  }
  return response.url;
}
