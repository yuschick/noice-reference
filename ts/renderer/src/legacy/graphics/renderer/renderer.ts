import { Nullable } from '@noice-com/utils';
import * as THREE from 'three';

import { AnalyticsCounterHandler } from '../analyticscounterhandler';
import { TARGET_BASELINE_FRAMES_PER_SECOND } from '../constants';
import { FrameClockHandler } from '../frameclock';
import { FrameStatsHandler } from '../framestats';
import { RenderQualityObservables } from '../renderquality';
import { StreamStatsHandler } from '../streamstats';
import { StreamTextureHandler } from '../streamtexture';
import { CommonExternalRendererProps, FrameStatsCallback, RendererStats } from '../types';

import { OnRenderHandler } from './onrenderhandler';

import { Sandbox } from '@legacy/sandbox';

export interface RendererProps {
  canvas: Nullable<OffscreenCanvas | HTMLCanvasElement>;
  renderQualityObservables: RenderQualityObservables;
  renderVideoFrame: boolean;
  dynamicFrameLimiter: boolean;
}

export abstract class NoiceRenderer {
  private _debugEnabled = false;
  public get debugEnabled(): boolean {
    return this._debugEnabled;
  }
  public set debugEnabled(value: boolean) {
    this._debugEnabled = value;
  }

  private _renderingPaused = false;
  public get renderingPaused() {
    return this._renderingPaused;
  }
  public set renderingPaused(value) {
    this._renderingPaused = value;
  }

  private _frameStatsCallback: Nullable<FrameStatsCallback> = null;
  public get frameStatsCallback(): Nullable<FrameStatsCallback> {
    return this._frameStatsCallback;
  }
  public set frameStatsCallback(value: Nullable<FrameStatsCallback>) {
    this._frameStatsCallback = value;
  }

  private _streamTexture: StreamTextureHandler = new StreamTextureHandler();
  public get streamTexture(): Nullable<THREE.CanvasTexture> {
    return this._streamTexture.texture.value;
  }

  private _frameClockHandler: FrameClockHandler = new FrameClockHandler();
  public get frameClockHandler(): FrameClockHandler {
    return this._frameClockHandler;
  }

  private _frameStatsHandler: FrameStatsHandler = new FrameStatsHandler({
    frameClockHandler: this._frameClockHandler,
  });
  public get frameStatsHandler(): FrameStatsHandler {
    return this._frameStatsHandler;
  }

  private _streamStatsHandler: StreamStatsHandler = new StreamStatsHandler();
  public get streamStatsHandler(): StreamStatsHandler {
    return this._streamStatsHandler;
  }

  private _analyticsCounterHandler: AnalyticsCounterHandler = new AnalyticsCounterHandler(
    {
      frameClockHandler: this._frameClockHandler,
    },
  );
  public get analyticsCounterHandler(): AnalyticsCounterHandler {
    return this._analyticsCounterHandler;
  }

  private _unregisterCallbacks: VoidFunction[] = [];
  public get unregisterCallbacks(): VoidFunction[] {
    return this._unregisterCallbacks;
  }

  private _sandbox: Nullable<Sandbox> = null;
  public get sandbox(): Nullable<Sandbox> {
    return this._sandbox;
  }

  private _canvas: Nullable<OffscreenCanvas | HTMLCanvasElement> = null;
  public get canvas(): Nullable<OffscreenCanvas | HTMLCanvasElement> {
    return this._canvas;
  }

  /*
    Do not start modifying this directly often for safety.
    We should mostly that push handlers to it and never remove 
    them until the renderer gets disposed of
  */
  private _onRenderHandlers: OnRenderHandler[] = [];
  public get onRenderHandlers(): OnRenderHandler[] {
    return this._onRenderHandlers;
  }
  public set onRenderHandlers(value: OnRenderHandler[]) {
    this._onRenderHandlers = value;
  }

  private _activeCameraUnregister: Nullable<VoidFunction> = null;
  private _dynamicFrameLimiter = false;
  private _commonExternalProps: CommonExternalRendererProps;

  constructor(
    { canvas, renderQualityObservables, dynamicFrameLimiter }: RendererProps,
    externalProps?: CommonExternalRendererProps,
  ) {
    this._commonExternalProps = externalProps ?? {};
    this._dynamicFrameLimiter = dynamicFrameLimiter;
    this._canvas = canvas;
    this._onRenderHandlers.push(
      this._frameClockHandler,
      this._frameStatsHandler,
      this._analyticsCounterHandler,
    );
    this._streamTexture.texture.onValue(() => this.onStreamTextureChanged());

    this._unregisterCallbacks.push(
      renderQualityObservables.frameRate.onValue((frameRate) =>
        this._handleFrameRateChange(frameRate as number),
      ),
    );
  }

  private _handleFrameRateChange(frameRate: number): void {
    this._frameClockHandler.targetSettingsFramesPerSecond =
      TARGET_BASELINE_FRAMES_PER_SECOND / frameRate;
  }

  public abstract onActiveCameraChanged(): void;
  public abstract onStreamTextureChanged(): void;
  public abstract getGLRenderer(): THREE.WebGLRenderer;
  public abstract render(): void;

  public registerSandbox(sandbox: Sandbox): void {
    // If we are registering new scene, let's stop listening to old camera changes
    this._activeCameraUnregister?.();

    this._sandbox = sandbox;

    this._activeCameraUnregister = this._sandbox.activeCamera.onValue(() =>
      this.onActiveCameraChanged(),
    );

    this.onActiveCameraChanged();
  }

  public updateVideoFrame(frame: VideoFrame): void {
    this._streamTexture.updateFromVideoFrame(frame);
    this._streamStatsHandler.update();
  }

  public preRender(): boolean {
    this._onRenderHandlers.forEach((handler) =>
      handler.onPreRender({
        willRender: this._frameClockHandler.renderFrame,
        dynamicFrameLimiter: this._dynamicFrameLimiter,
        debugEnabled: this.debugEnabled,
      }),
    );

    const photoMode = !!this._commonExternalProps.photoMode;

    return photoMode ? true : this._frameClockHandler.renderFrame;
  }

  public postRender() {
    this._onRenderHandlers.forEach((handler) => handler.onPostRender());

    if (this._debugEnabled) {
      this._frameStatsCallback?.({
        frameTime: this._frameClockHandler.deltaTime,
        worldMatrixUpdates: this._frameStatsHandler.matrixUpdateStats.matriceWorldCount,
        matrixUpdates: this._frameStatsHandler.matrixUpdateStats.matriceCount,
        ...this.getStats(),
      });
    }

    this._frameClockHandler.deltaTime = 0;
  }

  public resize(width: number, height: number, devicePixelRatio: number): void {
    this.getGLRenderer().setPixelRatio(devicePixelRatio);
    this.getGLRenderer().setSize(
      width,
      height,
      this.getGLRenderer().domElement?.style !== undefined,
    );

    if (!this._sandbox?.visible) {
      return;
    }

    this._sandbox.resize?.(width, height, devicePixelRatio);
  }

  public destruct(): void {
    this._activeCameraUnregister?.();
    this._unregisterCallbacks.forEach((callback) => callback());
    this._sandbox = null;

    // For HTMLCanvasElement run remove
    if (this.getGLRenderer().domElement) {
      this.getGLRenderer().domElement.remove();
    }

    this.getGLRenderer().setAnimationLoop(null);
    this.getGLRenderer().dispose();

    this._streamTexture.destruct();

    this._onRenderHandlers.forEach((handler) => handler.dispose());
    this._onRenderHandlers = [];
  }

  public getCanvas(): HTMLCanvasElement {
    return this.getGLRenderer().domElement;
  }

  public getGLContext() {
    return this.getGLRenderer().getContext();
  }

  public getDrawingBufferSize(): THREE.Vector2 {
    return this.getGLRenderer().getDrawingBufferSize(new THREE.Vector2());
  }

  public getStats(): RendererStats {
    return {
      textures: this.getGLRenderer().info.memory.textures,
      geometries: this.getGLRenderer().info.memory.geometries,
    };
  }
}
