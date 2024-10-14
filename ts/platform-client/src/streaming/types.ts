export interface AddConnectionProperties {
  id: string;
  egressType: string;
  conn: RTCPeerConnection;
}

export interface RemoveConnectionProperties {
  conn: RTCPeerConnection;
}

export interface StatsCollectorOptions {
  interval?: number;
}

export type StatsListener = (ev: StatsEvent) => void;

export type BaseStats = {
  id: string;

  // totals for the whole lifetime of the track
  timeTotal: number;
  bytesReceivedTotal: number;
  packetsReceivedTotal: number;
  packetsLostTotal: number;
  packetsDiscardedTotal: number;
  nackCountTotal: number;

  // stats for the sample period
  bytesReceived: number;
  packetsReceived: number;
  packetsLost: number;
  packetsDiscarded: number;
  nackCount: number;

  // state of the jitter buffer
  jitter: number;
  jitterBufferDelay: number;
  jitterBufferEmittedCount: number;
};

export type TrackStats = VideoTrackStats | AudioTrackStats;

export function isAudioTrackStats(trackStats: TrackStats): trackStats is AudioTrackStats {
  return trackStats && trackStats.kind === 'audio';
}

export function isVideoTrackStats(trackStats: TrackStats): trackStats is VideoTrackStats {
  return trackStats && trackStats.kind === 'video';
}

export type VideoTrackStats = BaseStats & {
  kind: 'video';

  // video totals
  firCountTotal: number;
  pliCountTotal: number;
  freezeCountTotal?: number;
  freezeDurationTotal?: number;
  pauseCountTotal?: number;
  pauseDurationTotal?: number;
  videoFramesReceivedTotal: number;
  videoFramesDecodedTotal: number;
  videoKeyFramesDecodedTotal: number;
  videoFramesDroppedTotal: number;

  // video sample stats
  firCount: number;
  pliCount: number;
  freezeCount?: number;
  freezeDuration?: number;
  pauseCount?: number;
  pauseDuration?: number;
  videoFramesReceived: number;
  videoFramesDecoded: number;
  videoKeyFramesDecoded: number;
  videoFramesDropped: number;

  // video stats
  frameWidth?: number;
  frameHeight?: number;
};

export type AudioTrackStats = BaseStats & {
  kind: 'audio';

  // audio totals
  audioSamplesReceivedTotal: number;

  // audio sample stats
  audioSamplesReceived: number;
};

export interface ConnStats {
  id: string;
  egressType: string;
  sampleTimestamp: number;
  sampleLength: number;
  tracks: { [id: string]: TrackStats };
  currentRoundTripTime?: number;
  totalRoundTripTime?: number;
  totalBytesReceived: number;
  bytesReceived: number;
}

export interface StatsEvent {
  connections: { [id: string]: ConnStats };
}
