import { PercentileCalculator } from '@noice-com/utils';
import * as THREE from 'three';

import { StreamRenderStats } from './types';

export class StreamStats {
  private _clock: THREE.Clock;
  private _updateTimePC: PercentileCalculator;

  constructor() {
    this._clock = new THREE.Clock();
    this._updateTimePC = new PercentileCalculator(1, 0, 100);
  }

  public update() {
    if (!this._clock.running) {
      this._clock.start();
      return;
    }

    const delta = this._clock.getDelta();
    this._updateTimePC.add(delta * 1000);
  }

  public getStats(): StreamRenderStats {
    const metrics: StreamRenderStats = {
      avg: this._updateTimePC.average(),
      p50: this._updateTimePC.percentile(0.5),
      p75: this._updateTimePC.percentile(0.75),
      p90: this._updateTimePC.percentile(0.9),
      p99: this._updateTimePC.percentile(0.99),
    };

    this._updateTimePC.reset();
    return metrics;
  }
}
