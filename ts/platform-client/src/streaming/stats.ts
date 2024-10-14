import {
  AddConnectionProperties,
  ConnStats,
  RemoveConnectionProperties,
  StatsCollectorOptions,
  StatsEvent,
  StatsListener,
  TrackStats,
} from './types';

interface Gatherer {
  added: number;
  conn: RTCPeerConnection;
  id: string;
  egressType: string;

  lastStats?: ConnStats;
}

type ExtendedStats = RTCInboundRtpStreamStats & {
  freezeCount: number;
  totalFreezesDuration: number;
  pauseCount: number;
  totalPausesDuration: number;
};

export class StatsCollector {
  private _listeners: StatsListener[] = [];
  private _interval = 5000;
  private _intervalHandle?: ReturnType<typeof setInterval>;
  private _connections: Map<RTCPeerConnection, Gatherer> = new Map();

  constructor(options?: StatsCollectorOptions) {
    if (options?.interval) {
      this._interval = options.interval;
    }
  }

  private async _gatherConnStats(g: Gatherer): Promise<ConnStats> {
    const stats = await g.conn.getStats();

    const lastStats: ConnStats = g.lastStats || {
      id: g.id,
      egressType: g.egressType,
      tracks: {},
      sampleTimestamp: g.added,
      sampleLength: 0,
      totalRoundTripTime: 0,
      currentRoundTripTime: 0,
      totalBytesReceived: 0,
      bytesReceived: 0,
    };
    const sampleTime = Date.now();
    const timeTotal = sampleTime - g.added;
    const trackStats: { [trackID: string]: TrackStats } = {};
    const sampleLength = sampleTime - lastStats.sampleTimestamp;
    let currentRtt: number | undefined;
    let totalRtt: number | undefined;
    let totalBytesReceived = 0;

    stats.forEach((report, key) => {
      if (report.type === 'inbound-rtp') {
        const inboundReport = report as ExtendedStats;

        let lastTrackStats = lastStats.tracks[key];

        const type = inboundReport.kind === 'video' ? 'video' : 'audio';

        if (lastTrackStats?.kind !== type) {
          lastTrackStats = undefined;
        }

        const genericTrackStats = {
          id: key,
          timeTotal,

          bytesReceivedTotal: inboundReport.bytesReceived || 0,
          packetsReceivedTotal: inboundReport.packetsReceived || 0,
          packetsLostTotal: inboundReport.packetsLost || 0,
          packetsDiscardedTotal: inboundReport.packetsDiscarded || 0,
          nackCountTotal: inboundReport.nackCount || 0,

          jitter: inboundReport.jitter || 0,
          jitterBufferDelay: inboundReport.jitterBufferDelay || 0,
          jitterBufferEmittedCount: inboundReport.jitterBufferEmittedCount || 0,

          bytesReceived:
            (inboundReport.bytesReceived || 0) -
            (lastTrackStats?.bytesReceivedTotal || 0),
          packetsReceived:
            (inboundReport.packetsReceived || 0) -
            (lastTrackStats?.packetsReceivedTotal || 0),
          packetsLost:
            (inboundReport.packetsLost || 0) - (lastTrackStats?.packetsLostTotal || 0),
          packetsDiscarded:
            (inboundReport.packetsDiscarded || 0) -
            (lastTrackStats?.packetsDiscardedTotal || 0),
          nackCount:
            (inboundReport.nackCount || 0) - (lastTrackStats?.nackCountTotal || 0),
        };

        switch (type) {
          case 'audio':
            trackStats[key] = {
              ...genericTrackStats,
              kind: 'audio',
              audioSamplesReceivedTotal: inboundReport.totalSamplesReceived || 0,

              audioSamplesReceived:
                (inboundReport.totalSamplesReceived || 0) -
                  (lastTrackStats?.kind === 'audio' &&
                    lastTrackStats?.audioSamplesReceivedTotal) || 0,
            };
            break;
          case 'video':
            trackStats[key] = {
              ...genericTrackStats,
              kind: 'video',
              firCountTotal: inboundReport.firCount || 0,
              pliCountTotal: inboundReport.pliCount || 0,
              freezeCountTotal: inboundReport.freezeCount || 0,
              freezeDurationTotal: inboundReport.totalFreezesDuration || 0,
              pauseCountTotal: inboundReport.pauseCount || 0,
              pauseDurationTotal: inboundReport.totalPausesDuration || 0,
              videoFramesReceivedTotal: inboundReport.framesReceived || 0,
              videoFramesDecodedTotal: inboundReport.framesDecoded || 0,
              videoKeyFramesDecodedTotal: inboundReport.keyFramesDecoded || 0,
              videoFramesDroppedTotal: inboundReport.framesDropped || 0,

              frameHeight: inboundReport.frameHeight || 0,
              frameWidth: inboundReport.frameWidth || 0,

              firCount:
                (inboundReport.firCount || 0) -
                  (lastTrackStats?.kind === 'video' && lastTrackStats?.firCount) || 0,
              pliCount:
                (inboundReport.pliCount || 0) -
                  (lastTrackStats?.kind === 'video' && lastTrackStats?.pliCount) || 0,
              freezeCount:
                (inboundReport.freezeCount || 0) -
                  (lastTrackStats?.kind === 'video' &&
                    lastTrackStats?.freezeCountTotal) || 0,
              freezeDuration:
                (inboundReport.totalFreezesDuration || 0) -
                  (lastTrackStats?.kind === 'video' &&
                    lastTrackStats?.freezeDurationTotal) || 0,
              pauseCount:
                (inboundReport.pauseCount || 0) -
                  (lastTrackStats?.kind === 'video' && lastTrackStats?.pauseCountTotal) ||
                0,
              pauseDuration:
                (inboundReport.totalPausesDuration || 0) -
                  (lastTrackStats?.kind === 'video' &&
                    lastTrackStats?.pauseDurationTotal) || 0,
              videoFramesReceived:
                (inboundReport.framesReceived || 0) -
                ((lastTrackStats?.kind === 'video' &&
                  lastTrackStats?.videoFramesReceivedTotal) ||
                  0),
              videoFramesDecoded:
                (inboundReport.framesDecoded || 0) -
                ((lastTrackStats?.kind === 'video' &&
                  lastTrackStats?.videoFramesDecodedTotal) ||
                  0),
              videoKeyFramesDecoded:
                (inboundReport.keyFramesDecoded || 0) -
                ((lastTrackStats?.kind === 'video' &&
                  lastTrackStats?.videoKeyFramesDecodedTotal) ||
                  0),
              videoFramesDropped:
                (inboundReport.framesDropped || 0) -
                ((lastTrackStats?.kind === 'video' &&
                  lastTrackStats?.videoFramesDroppedTotal) ||
                  0),
            };

            break;
        }
      } else if (report.type === 'candidate-pair') {
        const candidatePairReport = report as RTCIceCandidatePairStats;
        const transport = stats.get(candidatePairReport.transportId);

        if (
          candidatePairReport.state === 'succeeded' &&
          transport &&
          transport.selectedCandidatePairId === candidatePairReport.id
        ) {
          currentRtt = candidatePairReport.currentRoundTripTime;
          totalRtt = candidatePairReport.totalRoundTripTime;
          totalBytesReceived = candidatePairReport.bytesReceived || 0;
        }
      }
    });

    const newStats = {
      id: g.id,
      egressType: g.egressType,
      sampleTimestamp: sampleTime,
      sampleLength: sampleLength,
      tracks: trackStats,
      currentRoundTripTime: currentRtt,
      totalRoundTripTime: totalRtt,
      totalBytesReceived: totalBytesReceived,
      bytesReceived: totalBytesReceived - lastStats.totalBytesReceived,
    };

    g.lastStats = newStats;

    return newStats;
  }

  private async _gatherStats(): Promise<StatsEvent> {
    const connections: { [id: string]: ConnStats } = {};

    for (const g of this._connections.values()) {
      connections[g.id] = await this._gatherConnStats(g);
    }

    return { connections };
  }

  private _notifyListeners(ev: StatsEvent): void {
    this._listeners.forEach((listener) => {
      listener(ev);
    });
  }

  public addListener(listener: StatsListener): () => void {
    this._listeners.push(listener);

    return () => {
      this.removeListener(listener);
    };
  }

  public removeListener(listener: StatsListener): void {
    const index = this._listeners.indexOf(listener);

    if (index > -1) {
      this._listeners.splice(index, 1);
    }
  }

  public addConnection({ id, egressType, conn }: AddConnectionProperties): void {
    this._connections.set(conn, {
      conn: conn,
      id: id,
      egressType: egressType,
      added: Date.now(),
    });

    if (!this._intervalHandle) {
      this._intervalHandle = setInterval(async () => {
        this._notifyListeners(await this._gatherStats());
      }, this._interval);
    }
  }

  public removeConnection({ conn }: RemoveConnectionProperties): void {
    this._connections.delete(conn);

    if (this._connections.size === 0) {
      this._intervalHandle && clearInterval(this._intervalHandle);
      this._intervalHandle = undefined;
    }
  }

  public getStats(): Promise<StatsEvent> {
    return this._gatherStats();
  }

  public async stop(): Promise<void> {
    this._notifyListeners(await this._gatherStats());

    this._intervalHandle && clearInterval(this._intervalHandle);
    this._intervalHandle = undefined;
    this._connections.clear();
    this._listeners = [];
  }
}
