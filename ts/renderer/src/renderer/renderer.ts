import { Nullable, makeLoggers } from '@noice-com/utils';
import * as THREE from 'three';

import { TARGET_BASELINE_FRAMES_PER_SECOND } from './constants';
import { RendererFlags, RendererProps } from './data/types';
import { FrameAnalytics } from './stats/frameanalytics';
import { FrameClock } from './stats/frameclock';
import { FrameStats } from './stats/framestats';
import { StreamStats } from './stats/streamstats';
import { ClearFlags, FrameRenderStats, FrameRenderStatsCallback } from './stats/types';
import { StreamRenderHandler } from './stream';
import { RendererParams } from './types';

import { Scene } from 'scene/scene';

const { logError } = makeLoggers('Renderer');

export class Renderer {
  private _renderer: Nullable<THREE.WebGLRenderer> = null;
  private _scene: Scene;
  private _frameRenderStatsFailed = false;

  private _rendererProps: RendererProps;
  public get rendererProps() {
    return this._rendererProps;
  }

  private _rendererFlags: RendererFlags;
  public get rendererFlags() {
    return this._rendererFlags;
  }

  private _streamRenderHandler: StreamRenderHandler;
  public get streamRenderHandler() {
    return this._streamRenderHandler;
  }

  private _frameClock: FrameClock;
  public get frameClock() {
    return this._frameClock;
  }

  private _frameStats: FrameStats;
  public get frameStats() {
    return this._frameStats;
  }

  private _frameAnalytics: FrameAnalytics;
  public get frameAnalytics() {
    return this._frameAnalytics;
  }

  private _streamStats: StreamStats;
  public get streamStats() {
    return this._streamStats;
  }

  private _displayFrameRenderStats: boolean;
  public get displayFrameRenderStats() {
    return this._displayFrameRenderStats;
  }
  public set displayFrameRenderStats(value: boolean) {
    this._displayFrameRenderStats = value;
  }

  private _frameRenderStatsCallback: Nullable<FrameRenderStatsCallback> = null;
  public get frameRenderStatsCallback(): Nullable<FrameRenderStatsCallback> {
    return this._frameRenderStatsCallback;
  }
  public set frameRenderStatsCallback(value: Nullable<FrameRenderStatsCallback>) {
    this._frameRenderStatsCallback = value;
  }

  public constructor({ rendererFlags, rendererProps, scene }: RendererParams) {
    this._rendererProps = rendererProps;
    this._rendererFlags = rendererFlags;
    this._scene = scene;

    this._frameClock = new FrameClock(rendererFlags);
    this._frameStats = new FrameStats(this._frameClock);
    this._frameAnalytics = new FrameAnalytics(this._frameClock);
    this._streamStats = new StreamStats();

    this._streamRenderHandler = new StreamRenderHandler(this.getCanvas());
    this._displayFrameRenderStats = false;
  }

  private _initRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
      canvas: this._rendererProps.canvas || undefined,
      alpha: this._rendererFlags.useVideoFrame ? false : true,
      antialias: true,
      precision: 'mediump',
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
      depth: true,
      stencil: false,
      logarithmicDepthBuffer: true,
    });

    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    if (!this._rendererProps.isPhotoMode) {
      renderer.setAnimationLoop(() => this.render());
    }

    return renderer;
  }

  private _onPreRender() {
    this._frameClock.onPreRender();
    this._frameStats.onPreRender(!!this.frameRenderStatsCallback);
    this._frameAnalytics.onPreRender();
  }

  private _onPostRender() {
    this._frameClock.onPostRender();
    this._frameStats.onPostRender();
    this._frameAnalytics.onPostRender();

    if (this.frameRenderStatsCallback) {
      const frameRenderStats = this.getFrameRenderStats();
      this._handleFrameRenderStats(frameRenderStats);
    }

    this._frameClock.deltaTime = 0;
  }

  private async _handleFrameRenderStats(frameRenderStats: FrameRenderStats) {
    if (!this._frameRenderStatsFailed && this.frameRenderStatsCallback) {
      // Give up on calling the callback if it failed once
      try {
        await this.frameRenderStatsCallback?.(frameRenderStats);
      } catch (error) {
        this._frameRenderStatsFailed = true;
        logError('Failed to call frameRenderStatsCallback', error);
        logError('Disabling frameRenderStatsCallback. Frame stats panel wont work :(.');
      }
    }
  }

  private _clear(renderer: THREE.WebGLRenderer, clearFlags: ClearFlags) {
    switch (clearFlags) {
      case ClearFlags.Color:
        renderer.clearColor();
        break;
      case ClearFlags.Depth:
        renderer.clearDepth();
        break;
      case ClearFlags.ColorDepth:
        renderer.clear();
        break;
    }
  }

  private _ensureAspectRatio(camera: THREE.PerspectiveCamera) {
    const bufferSize = this.getDrawingBufferSize();
    const currentAspect = camera.aspect;
    const expectedAspect = bufferSize.x / bufferSize.y;

    if (currentAspect !== expectedAspect) {
      camera.aspect = expectedAspect;
      camera.updateProjectionMatrix();
    }
  }

  public render() {
    this._onPreRender();

    const shouldRenderFrame =
      this._scene.hasLayers() &&
      (this._rendererProps.isPhotoMode || this._frameClock.shouldRenderFrame);
    if (!shouldRenderFrame) {
      return;
    }

    const renderer = this.getGLRenderer();
    this._clear(renderer, ClearFlags.ColorDepth);

    const stateController = this._scene.stateController;
    if (stateController) {
      stateController.update(this._scene, this._frameClock.deltaTime);
    }

    const camera = this._scene.camera as THREE.PerspectiveCamera;
    if (camera) {
      // When initializing a Scene we can get a race condition
      // where the initial resize event happens before the Scene is built
      // This means the camera ref is null and its aspect is never updated
      // Since otherwise the resize is one operation, we can safely handle this here
      this._ensureAspectRatio(camera);

      const layers = this._scene.layers;
      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        this._clear(renderer, layer.clearFlags);

        renderer.render(layer, camera);
      }
    }

    this._onPostRender();
  }

  public getCanvas(): HTMLCanvasElement {
    return this.getGLRenderer().domElement;
  }

  public getDrawingBufferSize(): THREE.Vector2 {
    return this.getGLRenderer().getDrawingBufferSize(new THREE.Vector2());
  }

  public getGLContext() {
    return this.getGLRenderer().getContext();
  }

  public getGLRenderer(): THREE.WebGLRenderer {
    if (!this._renderer) {
      this._renderer = this._initRenderer();
    }

    return this._renderer;
  }

  public resize(width: number, height: number, devicePixelRatio: number): void {
    const updateStyle = this.getGLRenderer().domElement?.style !== undefined;
    this.getGLRenderer().setPixelRatio(devicePixelRatio);
    this.getGLRenderer().setSize(width, height, updateStyle);
  }

  public updateVideoFrame(frame: VideoFrame): void {
    this._streamRenderHandler.updateVideoFrame(frame);
    this._streamStats.update();
  }

  public getFrameRenderStats(): FrameRenderStats {
    return {
      frameTime: this._frameClock.deltaTime,
      worldMatrixUpdates: this._frameStats.matrixUpdateStats.matriceWorldCount,
      matrixUpdates: this._frameStats.matrixUpdateStats.matriceCount,
      textures: this.getGLRenderer().info.memory.textures,
      geometries: this.getGLRenderer().info.memory.geometries,
    };
  }

  public onFrameRateChange(frameRate: number): void {
    this._frameClock.targetSettingsFramesPerSecond =
      TARGET_BASELINE_FRAMES_PER_SECOND / frameRate;
  }

  public dispose() {
    this._frameClock.dispose();
    this._frameStats.dispose();
    this._frameAnalytics.dispose();

    // For HTMLCanvasElement run remove
    if (this.getGLRenderer().domElement) {
      this.getGLRenderer().domElement.remove();
    }

    this.getGLRenderer().setAnimationLoop(null);
    this.getGLRenderer().dispose();
    this._streamRenderHandler.dispose();
  }
}
