import { Nullable } from '@noice-com/utils';

import { Renderer } from './renderer';
import { RendererSettingsHandler } from './renderer/data';
import { hookUpdateMatrix, unhookUpdateMatrix } from './renderer/debug';
import {
  FrameAnalyticsStats,
  FrameRenderStatsCallback,
  SceneStats,
} from './renderer/stats/types';
import { Scene } from './scene/scene';

import { RenderQualitySettings } from 'api';
import { GraphicsControllerProps } from 'api/types';

export abstract class GraphicsController {
  private _callbacks: VoidFunction[] = [];

  private _scene: Scene;
  public get scene(): Scene {
    return this._scene;
  }

  private _rendererSettingsHandler: RendererSettingsHandler =
    new RendererSettingsHandler();
  public get rendererSettingsHandler(): RendererSettingsHandler {
    return this._rendererSettingsHandler;
  }

  private _renderer: Renderer;
  public get renderer() {
    return this._renderer;
  }

  constructor({ rendererFlags, rendererProps }: GraphicsControllerProps) {
    this._scene = new Scene();

    this._renderer = new Renderer({
      rendererFlags,
      rendererProps,
      scene: this.scene,
    });

    this._registerCallbacks();
  }

  private _registerCallbacks() {
    const callbacks = [
      this._rendererSettingsHandler.frameRate.onValue((frameRate) =>
        this.renderer.onFrameRateChange(frameRate as number),
      ),
    ];

    // TODO: Consider moving the VoidFunction array to the RenderSettingsHandler
    // Then its out of the way and we can dispose it there
    // Just need a good pattern for "listening" to the events
    this._callbacks.push(...callbacks);
  }

  public abstract getSceneStats(): SceneStats;

  public resize(width: number, height: number, devicePixelRatio: number): void {
    this.renderer.resize(width, height, devicePixelRatio);
    this.scene.resize(width, height);
  }

  public setRenderQualitySettings({
    frameRate,
    shadowType,
    shadowQuality,
    lightingType,
    crowdAnimationRate,
    crowdDetail,
    crowdMode,
    antiAliasing,
  }: RenderQualitySettings) {
    const renderSettingsHandler = this._rendererSettingsHandler;
    renderSettingsHandler.frameRate.value = frameRate;
    renderSettingsHandler.shadowType.value = shadowType;
    renderSettingsHandler.shadowQuality.value = shadowQuality;
    renderSettingsHandler.lightingType.value = lightingType;
    renderSettingsHandler.crowdAnimationRate.value = crowdAnimationRate;
    renderSettingsHandler.crowdDetail.value = crowdDetail;
    renderSettingsHandler.crowdMode.value = crowdMode;
    renderSettingsHandler.antiAliasing.value = antiAliasing;
  }

  public getFrameAnalyticsStats(): FrameAnalyticsStats {
    return {
      renderStats: this.renderer.getFrameRenderStats(),
      timeStats: this.renderer.frameStats.getStats(),
      analyticsStats: this.renderer.frameAnalytics.getStats(),
      sceneStats: this.getSceneStats(),
      streamStats: this.renderer.streamStats.getStats(),
    };
  }

  public setFrameRenderStatsCallback(callback: Nullable<FrameRenderStatsCallback>): void {
    this.renderer.frameRenderStatsCallback = callback;

    if (!callback) {
      unhookUpdateMatrix();
      return;
    }

    hookUpdateMatrix(this.renderer.frameStats.matrixUpdateStats);
  }

  public dispose() {
    this.renderer.dispose();
    this.scene.dispose();

    this._callbacks.forEach((callback) => callback());
  }
}
