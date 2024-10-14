import { AnalyticsEventClientRenderingStatsRendererClass } from '@noice-com/schemas/analytics/analytics.pb';

export type RenderingStats = {
  frameTime: FrameTimeStats;

  resources: RendererStats;

  frameDatas: AnalyticsCounterStats;

  rendererClass: AnalyticsEventClientRenderingStatsRendererClass;
  emojiCount: number;
  emoteCount: number;
  avatarCount: number;
};

export interface RendererStats {
  geometries: number;
  textures: number;
}

export interface FrameTimeStats {
  avg: number;
  p50: number;
  p75: number;
  p90: number;
  p99: number;
  jankCount: number;
}

export type StreamRenderStats = {
  avg: number;
  p50: number;
  p75: number;
  p90: number;
  p99: number;
};

export type FrameStats = {
  frameTime: number;
  geometries: number;
  textures: number;
  matrixUpdates: number;
  worldMatrixUpdates: number;
};

export type AnalyticsCounterStats = {
  sampleCount: number; // Total number of samples

  // Limiter Counts (mutually exclusive)
  staticLimiterCount: number; // Number of samples that hit the static limiter (60 or 30 fps depending on settings)
  dynamicLimiterCount: number; // Number of samples that hit the dyanmic limiter (30fps)
  underLimiterCount: number; // Number of samples that were slower than any limiter

  // Render Thread Counts (mutually exclusive)
  renderThread60Count: number; // Number of samples where render thread time was < 16.66ms
  renderThread30Count: number; // Number of samples where render thread time was > 16.66ms but < 33.33ms
  renderThreadUnder30Count: number; // Number of samples where render thread time was > 33.33ms
};

export interface CommonExternalRendererProps {
  /**
   * Controls if the renderer should be in photo mode.
   *
   * This boolean is now done for mainly to support the
   * avatar screenshotting in profile service and could
   * be maybe supported in a better way someday.
   *
   * When set to true, the NoiceRenderers preRender function
   * will always return true, meaning that each frame gets rendered.
   * (no frame rate limiting). Also the setAnimationLoop callback
   * for THREE is not set. This means that each frame must be
   * manually rendered.
   */
  photoMode?: boolean;
}

export interface CompositorRenderHandlerProps {
  usePostProcessMask?: boolean;
}

export interface ExternalRendererProps {
  common?: CommonExternalRendererProps;
  compositor?: CompositorRenderHandlerProps;
  fallback?: boolean;
}

export type FrameStatsCallback = (stats: FrameStats) => void;
