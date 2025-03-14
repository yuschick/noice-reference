import { WebRTCMetrics } from 'lib/ts/gen/schemas/analytics/analytics.pb';

import { AudioTrackStats, ConnStats, VideoTrackStats } from './types';

export function getFullSessionMetrics(
  connStats: ConnStats,
  audio: AudioTrackStats,
  video: VideoTrackStats,
): Required<WebRTCMetrics> {
  return {
    sampleLengthMs: video.timeTotal,
    roundTripTimeSec: connStats.totalRoundTripTime ?? 0,
    roundTripTimesAvailable: connStats.totalRoundTripTime !== undefined,
    videoPacketsReceivedTotal: Math.max(0, video.packetsReceivedTotal),
    videoPacketsLostTotal: Math.max(0, video.packetsLostTotal),
    videoPacketsDiscardedTotal: Math.max(0, video.packetsDiscardedTotal),
    videoNackCountTotal: Math.max(0, video.nackCountTotal),
    videoFirCountTotal: Math.max(0, video.firCountTotal),
    videoPliCountTotal: Math.max(0, video.pliCountTotal),
    videoMebibytesReceivedTotal: Math.max(0, video.bytesReceivedTotal) / 1024 / 1024,
    videoJitterSec: Math.max(0, video.jitter),
    videoJitterBufferDelaySec: Math.max(0, video.jitterBufferDelay),
    videoJitterBufferEmittedCount: Math.max(0, video.jitterBufferEmittedCount),
    videoFrameWidth: video.frameWidth || 0,
    videoFrameHeight: video.frameHeight || 0,
    videoFreezeCountTotal: Math.max(0, video.freezeCountTotal || 0),
    videoFreezeDurationSecTotal: Math.max(0, video.freezeDurationTotal || 0),
    videoPauseCountTotal: Math.max(0, video.pauseCountTotal || 0),
    videoPauseDurationSecTotal: Math.max(0, video.pauseDurationTotal || 0),
    videoFramesReceivedTotal: Math.max(0, video.videoFramesReceivedTotal),
    videoFramesDecodedTotal: Math.max(0, video.videoFramesDecodedTotal),
    videoKeyFramesDecodedTotal: Math.max(0, video.videoKeyFramesDecodedTotal),
    videoFramesDroppedTotal: Math.max(0, video.videoFramesDroppedTotal),
    audioPacketsReceivedTotal: Math.max(0, audio.packetsReceivedTotal),
    audioPacketsLostTotal: Math.max(0, audio.packetsLostTotal),
    audioPacketsDiscardedTotal: Math.max(0, audio.packetsDiscardedTotal),
    audioNackCountTotal: Math.max(0, audio.nackCountTotal),
    audioMebibytesReceivedTotal: Math.max(0, audio.bytesReceivedTotal) / 1024 / 1024,
    audioJitterSec: Math.max(0, audio.jitter),
    audioJitterBufferDelaySec: Math.max(0, audio.jitterBufferDelay),
    audioJitterBufferEmittedCount: Math.max(0, audio.jitterBufferEmittedCount),
    audioSamplesReceivedTotal: Math.max(0, audio.audioSamplesReceivedTotal),
  };
}

export function getSampleMetrics(
  connStats: ConnStats,
  audio: AudioTrackStats,
  video: VideoTrackStats,
): Required<WebRTCMetrics> {
  return {
    sampleLengthMs: connStats.sampleLength,
    roundTripTimeSec: connStats.currentRoundTripTime ?? 0,
    roundTripTimesAvailable: connStats.currentRoundTripTime !== undefined,
    videoPacketsReceivedTotal: Math.max(0, video.packetsReceived),
    videoPacketsLostTotal: Math.max(0, video.packetsLost),
    videoPacketsDiscardedTotal: Math.max(0, video.packetsDiscarded),
    videoNackCountTotal: Math.max(0, video.nackCount),
    videoFirCountTotal: Math.max(0, video.firCount),
    videoPliCountTotal: Math.max(0, video.pliCount),
    videoMebibytesReceivedTotal: Math.max(0, video.bytesReceived) / 1024 / 1024,
    videoFreezeCountTotal: Math.max(0, video.freezeCount || 0),
    videoFreezeDurationSecTotal: Math.max(0, video.freezeDuration || 0),
    videoPauseCountTotal: Math.max(0, video.pauseCount || 0),
    videoPauseDurationSecTotal: Math.max(0, video.pauseDuration || 0),
    videoJitterSec: Math.max(0, video.jitter),
    videoJitterBufferDelaySec: Math.max(0, video.jitterBufferDelay),
    videoJitterBufferEmittedCount: Math.max(0, video.jitterBufferEmittedCount),
    videoFrameWidth: video.frameWidth || 0,
    videoFrameHeight: video.frameHeight || 0,
    videoFramesReceivedTotal: Math.max(0, video.videoFramesReceived),
    videoFramesDecodedTotal: Math.max(0, video.videoFramesDecoded),
    videoKeyFramesDecodedTotal: Math.max(0, video.videoKeyFramesDecoded),
    videoFramesDroppedTotal: Math.max(0, video.videoFramesDropped),
    audioPacketsReceivedTotal: Math.max(0, audio.packetsReceived),
    audioPacketsLostTotal: Math.max(0, audio.packetsLost),
    audioPacketsDiscardedTotal: Math.max(0, audio.packetsDiscarded),
    audioNackCountTotal: Math.max(0, audio.nackCount),
    audioMebibytesReceivedTotal: Math.max(0, audio.bytesReceived) / 1024 / 1024,
    audioJitterSec: Math.max(0, audio.jitter),
    audioJitterBufferDelaySec: Math.max(0, audio.jitterBufferDelay),
    audioJitterBufferEmittedCount: Math.max(0, audio.jitterBufferEmittedCount),
    audioSamplesReceivedTotal: Math.max(0, audio.audioSamplesReceived),
  };
}
