import { PercentileCalculator } from '@noice-com/utils';

import { FrameClock } from './frameclock';
import { FrameTimeStats, MatrixUpdateStats } from './types';

export class FrameStats {
  private _frameClock: FrameClock;
  private _frameTimePC: PercentileCalculator;
  private _jankCount: number;

  private _matrixUpdateStats: MatrixUpdateStats = new MatrixUpdateStats();
  public get matrixUpdateStats(): MatrixUpdateStats {
    return this._matrixUpdateStats;
  }

  constructor(frameClock: FrameClock) {
    this._frameClock = frameClock;
    this._frameTimePC = new PercentileCalculator(1, 0, 100);
    this._jankCount = 0;
  }

  public onPreRender(shouldReset: boolean): void {
    if (!shouldReset) {
      return;
    }

    this._matrixUpdateStats.reset();
  }

  public onPostRender(): void {
    this._frameTimePC.add(1000 * this._frameClock.renderTime);

    if (this._frameClock.renderTime > this._frameClock.targetFrameTime) {
      this._jankCount++;
    }
  }

  public dispose(): void {}

  public getStats(): FrameTimeStats {
    const metrics: FrameTimeStats = {
      avg: this._frameTimePC.average(),
      p50: this._frameTimePC.percentile(0.5),
      p75: this._frameTimePC.percentile(0.75),
      p90: this._frameTimePC.percentile(0.9),
      p99: this._frameTimePC.percentile(0.99),
      jankCount: this._jankCount,
    };

    this._jankCount = 0;
    this._frameTimePC.reset();

    return metrics;
  }
}
