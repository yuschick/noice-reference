import { PercentileCalculator } from '@noice-com/utils';

import { FrameClockHandler } from './frameclock';
import { OnRenderHandler, PreRenderProps } from './renderer/onrenderhandler';
import { FrameTimeStats } from './types';

import { MatrixUpdateStats } from '@legacy/helpers/debughooks';

interface FrameStatsHandlerProps {
  frameClockHandler: FrameClockHandler;
}

export class FrameStatsHandler implements OnRenderHandler {
  private _frameTimePC = new PercentileCalculator(1, 0, 100);
  private _jankCount = 0;
  private _frameClockHandler: FrameClockHandler;

  private _matrixUpdateStats: MatrixUpdateStats = new MatrixUpdateStats();
  public get matrixUpdateStats(): MatrixUpdateStats {
    return this._matrixUpdateStats;
  }

  constructor({ frameClockHandler }: FrameStatsHandlerProps) {
    this._frameClockHandler = frameClockHandler;
  }

  public onPreRender({ debugEnabled }: PreRenderProps): void {
    if (debugEnabled) {
      this._matrixUpdateStats.reset();
    }
  }

  public onPostRender(): void {
    this._frameTimePC.add(1000 * this._frameClockHandler.renderTime);

    if (this._frameClockHandler.renderTime > this._frameClockHandler.targetFrameTime) {
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
