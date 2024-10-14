import { AnalyticsEventClientRenderingStatsRendererClass } from '@noice-com/schemas/analytics/analytics.pb';
import { makeLoggers, Nullable } from '@noice-com/utils';
import * as THREE from 'three';

import { MAXIMUM_ALLOWED_GRAPHICS_INSTANCE_COUNT } from './constants';
import { DirectRenderer } from './direct/direct';
import { NoiceRenderer } from './renderer/renderer';
import { RenderQualityObservables } from './renderquality';
import { ExternalRendererProps, FrameStatsCallback, RenderingStats } from './types';

import { hookUpdateMatrix, unhookUpdateMatrix } from '@legacy/helpers/debughooks';

const { logError } = makeLoggers('Graphics');

// Disabled when upgrading three to 0.158.0 (was changed to be enabled by default, breaks hair etc.)
THREE.ColorManagement.enabled = false;

export class Graphics {
  public static Instances: Graphics[] = [];
  private _featureFlags: { [feature: string]: string } = {};
  private _renderQualityObservables: RenderQualityObservables =
    new RenderQualityObservables();
  public get renderQualityObservables(): RenderQualityObservables {
    return this._renderQualityObservables;
  }
  private _renderHandler: NoiceRenderer;
  private _fallback: boolean;

  public constructor(
    canvas: Nullable<OffscreenCanvas | HTMLCanvasElement> = null,
    featureFlags?: { [featureName: string]: string },
    externalProps?: ExternalRendererProps,
  ) {
    Graphics.Instances.push(this);

    if (Graphics.Instances.length > MAXIMUM_ALLOWED_GRAPHICS_INSTANCE_COUNT) {
      logError(
        `Maximum allowed Graphics instance count of ${MAXIMUM_ALLOWED_GRAPHICS_INSTANCE_COUNT} exceeded. ` +
          'The client performance will be negatively impacted!',
      );
    }

    this._featureFlags = featureFlags || {};

    this._fallback = externalProps?.fallback ?? false;

    const useDynamicFrameLimiter =
      this._getFeatureFlag('useDynamicFramerateLimiter', 'none') === 'true';

    this._renderHandler = new DirectRenderer(
      {
        canvas,
        renderQualityObservables: this._renderQualityObservables,
        renderVideoFrame: this._getFeatureFlag('useVideoFame', 'none') === 'true',
        dynamicFrameLimiter: useDynamicFrameLimiter,
      },
      externalProps,
    );
  }

  private _getFeatureFlag(name: string, defaultValue: string): string {
    return this._featureFlags[name] || defaultValue;
  }
  public destruct(): void {
    this._renderHandler.destruct();

    Graphics.Instances.splice(Graphics.Instances.indexOf(this), 1);
  }

  public resize(width: number, height: number, devicePixelRatio: number): void {
    this._renderHandler.resize(width, height, devicePixelRatio);
  }

  public setDebug(enabled: boolean): void {
    if (this.getRenderer().debugEnabled && !enabled) {
      unhookUpdateMatrix();
    }

    if (enabled) {
      // Only a single instance of the stats panel is allowed.
      Graphics.Instances.map((instance) => instance.setDebug(false));
      hookUpdateMatrix(this.getRenderer().frameStatsHandler.matrixUpdateStats);
    }

    this.getRenderer().debugEnabled = enabled;
  }

  public set onFrameStats(cb: Nullable<FrameStatsCallback>) {
    this.getRenderer().frameStatsCallback = cb;
  }

  public getStats(): RenderingStats {
    let rendererClass =
      AnalyticsEventClientRenderingStatsRendererClass.RENDERER_CLASS_DIRECT;
    if (this._fallback) {
      rendererClass =
        AnalyticsEventClientRenderingStatsRendererClass.RENDERER_CLASS_FALLBACK;
    }

    console.log(`Get stats legacy but: ${this._fallback}`);

    return {
      rendererClass,
      frameTime: this.getRenderer().frameStatsHandler.getStats(),
      resources: this.getRenderer().getStats(),
      avatarCount: 0,
      emojiCount: 0,
      emoteCount: 0,
      frameDatas: this.getRenderer().analyticsCounterHandler.getStats(),
    };
  }

  public getStreamStats() {
    const streamStats = this._renderHandler.streamStatsHandler.getStats();

    return {
      streamStats: {
        avg: streamStats.avg,
        p50: streamStats.p50,
        p75: streamStats.p75,
        p90: streamStats.p90,
        p99: streamStats.p99,
      },
    };
  }

  public getRenderer() {
    return this._renderHandler;
  }
}

if (typeof window !== 'undefined') {
  window.NOICE.Graphics = Graphics;
}
