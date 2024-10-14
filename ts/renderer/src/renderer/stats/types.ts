export type FrameRenderStatsCallback = (stats: FrameRenderStats) => void | Promise<void>;

export type FrameAnalyticsStats = {
  renderStats: FrameRenderStats;
  timeStats: FrameTimeStats;
  analyticsStats: AnalyticsCounterStats;
  sceneStats: SceneStats;
  streamStats: StreamRenderStats;
};

export type FrameRenderStats = {
  frameTime: number;
  geometries: number;
  textures: number;
  matrixUpdates: number;
  worldMatrixUpdates: number;
};

export interface FrameTimeStats {
  avg: number;
  p50: number;
  p75: number;
  p90: number;
  p99: number;
  jankCount: number;
}

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

export type SceneStats = {
  avatarCount: number;
};

export type StreamRenderStats = {
  avg: number;
  p50: number;
  p75: number;
  p90: number;
  p99: number;
};

export class MatrixUpdateStats {
  public matriceWorldCount = 0;
  public matriceCount = 0;

  public reset() {
    this.matriceWorldCount = 0;
    this.matriceCount = 0;
  }
}

export enum ClearFlags {
  DontClear,
  Color,
  Depth,
  ColorDepth,
}
