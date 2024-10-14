import { ANALYTICS_COUNTER_FREQUENCY } from '../constants';

import { FrameClock } from './frameclock';
import { AnalyticsCounterStats } from './types';

export class FrameAnalytics {
  private _frameClock: FrameClock;
  private _analyticsCounters: AnalyticsCounterStats;
  private _analyticsCounterDelta: number;

  constructor(frameClock: FrameClock) {
    this._frameClock = frameClock;
    this._analyticsCounters = this._resetMetrics();
    this._analyticsCounterDelta = 0;
  }

  private _resetMetrics(): AnalyticsCounterStats {
    return {
      sampleCount: 0,
      staticLimiterCount: 0,
      dynamicLimiterCount: 0,
      underLimiterCount: 0,
      renderThread60Count: 0,
      renderThread30Count: 0,
      renderThreadUnder30Count: 0,
    };
  }

  private _incrementAnalyticsCounters(renderThreadTime: number, frameTime: number): void {
    this._analyticsCounters.sampleCount++;

    const targetFrameTime = 1 / this._frameClock.targetFramesPerSecond;
    const targetSettingsFrameTime = 1 / this._frameClock.targetSettingsFramesPerSecond;
    const frameInterval = frameTime % 0.01667;

    // Limiter Counts (mutually exclusive)
    // Dynamic limiter
    if (
      this._frameClock.targetFramesPerSecond !==
        this._frameClock.targetSettingsFramesPerSecond &&
      frameInterval < targetFrameTime
    ) {
      this._analyticsCounters.dynamicLimiterCount++;
      // Static limiter
    } else if (frameInterval < targetSettingsFrameTime) {
      this._analyticsCounters.staticLimiterCount++;
      // Under limiter
    } else if (frameInterval > 0.03333) {
      this._analyticsCounters.underLimiterCount++;
    }

    // Render Thread Counts (mutually exclusive)
    if (renderThreadTime <= 1 / 60) {
      this._analyticsCounters.renderThread60Count++;
    }

    if (renderThreadTime > 1 / 60 && renderThreadTime <= 1 / 30) {
      this._analyticsCounters.renderThread30Count++;
    }

    if (renderThreadTime > 1 / 30) {
      this._analyticsCounters.renderThreadUnder30Count++;
    }
  }

  public onPreRender(): void {
    this._analyticsCounterDelta += this._frameClock.frameDelta;
  }

  public onPostRender(): void {
    if (this._analyticsCounterDelta > ANALYTICS_COUNTER_FREQUENCY) {
      this._incrementAnalyticsCounters(
        this._frameClock.renderTime,
        this._frameClock.frameDelta,
      );
      this._analyticsCounterDelta =
        this._analyticsCounterDelta % ANALYTICS_COUNTER_FREQUENCY;
    }
  }

  public dispose(): void {}

  public getStats(): AnalyticsCounterStats {
    const metrics: AnalyticsCounterStats = {
      sampleCount: this._analyticsCounters.sampleCount,
      staticLimiterCount: this._analyticsCounters.staticLimiterCount,
      dynamicLimiterCount: this._analyticsCounters.dynamicLimiterCount,
      underLimiterCount: this._analyticsCounters.underLimiterCount,
      renderThread60Count: this._analyticsCounters.renderThread60Count,
      renderThread30Count: this._analyticsCounters.renderThread30Count,
      renderThreadUnder30Count: this._analyticsCounters.renderThreadUnder30Count,
    };

    // Reset AnalyticsCounters
    this._analyticsCounters = this._resetMetrics();
    return metrics;
  }
}
