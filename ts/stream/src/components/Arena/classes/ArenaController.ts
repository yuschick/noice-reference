import { createNoiceWorker } from '@noice-com/platform-client';
import { ClientSideArena } from '@noice-com/schemas/arena/arena.pb';
import { Animation, AnimationCategory } from '@noice-com/schemas/avatar/animation.pb';
import { Avatar } from '@noice-com/schemas/avatar/avatar.pb';
import { Profile } from '@noice-com/schemas/profile/profile.pb';
import { ArenaConfig } from '@noice-com/schemas/rendering/config.pb';
import { ContentMode } from '@noice-com/schemas/rendering/transitions.pb';
import { Nullable, makeLoggers } from '@noice-com/utils';
import { RenderQualitySettings } from '@noice-com/web-renderer/src/api';
import {
  SceneStats,
  FrameAnalyticsStats,
  FrameRenderStatsCallback,
} from '@noice-com/web-renderer/src/renderer/stats/types';
import * as Comlink from 'comlink';

import { isOffscreenCanvasSupported } from '../utils';
// eslint-disable-next-line import/default
import arenaWorkerUrl from '../worker/Arena.worker.ts?worker&url';

import {
  ArenaControllerWebGL,
  BoosterProps,
  PlayerAnimationProps,
  PlayerEmojiProps,
  PlayerProps,
  TriggerCardSelectProps,
  TriggerRequestBoosterProps,
  UpdatePlayerProps,
} from './ArenaControllerWebGL';
import { OverlayController } from './OverlayController';

type ArenaControllerType = Comlink.Remote<ArenaControllerWebGL> | ArenaControllerWebGL;

const { logError } = makeLoggers('ArenaController');

const WEBWORKER_SUPPORTED = isOffscreenCanvasSupported();
const MEDIA_STREAM_TRACK_PROCESSOR_SUPPORTED =
  typeof MediaStreamTrackProcessor !== 'undefined';

export class ArenaController {
  private _featureFlags: { [featureName: string]: string };
  private _playerId: string;
  private _avatarAnimations: Animation[];

  private _initPromise: Nullable<Promise<void>> = null;

  private _webGLController: Nullable<ArenaControllerType> = null;
  private _overlayController: Nullable<OverlayController> = null;

  private _worker: Nullable<Worker> = null;

  private _canvas = document.createElement('canvas');
  private _overlay = document.createElement('div');

  constructor(
    featureFlags: { [featureName: string]: string },
    playerId: string,
    avatarAnimations: Animation[],
  ) {
    this._featureFlags = featureFlags;
    this._playerId = playerId;
    this._avatarAnimations = avatarAnimations;
  }
  private async _initializeMainThread() {
    const webGL = await import('./ArenaControllerWebGL');
    const c = new webGL.ArenaControllerWebGL(
      this._canvas,
      this._featureFlags,
      this._playerId,
      this._avatarAnimations,
    );

    this._webGLController = c;
  }

  private async _initializeWebWorker(): Promise<void> {
    this._worker = createNoiceWorker(arenaWorkerUrl);
    const Constructor = Comlink.wrap<typeof ArenaControllerWebGL>(this._worker);
    let offscreen: OffscreenCanvas;

    try {
      offscreen = this._canvas.transferControlToOffscreen();
    } catch (e) {
      logError('Error transferring control to offscreen canvas', e);
      return;
    }
    const c = await new Constructor(
      Comlink.transfer(offscreen, [offscreen]),
      this._featureFlags,
      this._playerId,
      this._avatarAnimations,
    );

    this._webGLController = c;
  }

  private async _initialize(): Promise<void> {
    if (!MEDIA_STREAM_TRACK_PROCESSOR_SUPPORTED) {
      const overlayLib = await import('./OverlayController');
      const c = new overlayLib.OverlayController(this._overlay);
      this._overlayController = c;
    }

    if (WEBWORKER_SUPPORTED) {
      return this._initializeWebWorker();
    }

    return this._initializeMainThread();
  }

  private async _getWebGLController(): Promise<ArenaControllerType> {
    await this.initialize();
    if (!this._webGLController) {
      throw new Error('WebGL controller not initialized');
    }
    return this._webGLController;
  }

  private async _setMediaStreamTrackProcessor(
    mediaStream: Nullable<MediaStream>,
  ): Promise<void> {
    const controller = await this._getWebGLController();

    if (!mediaStream) {
      return;
    }

    const videoTrack = mediaStream.getVideoTracks()[0];
    if (!videoTrack) {
      return;
    }

    const mediaStreamTrackProcessor = new MediaStreamTrackProcessor({
      track: videoTrack,
    });

    const stream = mediaStreamTrackProcessor.readable;

    controller.setVideoTrackStream(
      WEBWORKER_SUPPORTED ? Comlink.transfer(stream, [stream]) : stream,
    );
  }

  private async _addVideoToOverlay(mediaStream: Nullable<MediaStream>): Promise<void> {
    await this.initialize();

    if (!this._overlayController) {
      throw new Error('Overlay controller not initialized');
    }

    await this._overlayController.addVideo(mediaStream);
  }

  public get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  public get overlay(): HTMLDivElement {
    return this._overlay;
  }

  public initialize(): Promise<void> {
    if (!this._initPromise) {
      this._initPromise = this._initialize();
    }

    return this._initPromise;
  }

  public async close(): Promise<void> {
    if (this._initPromise) {
      await this._initPromise;
    }

    this._worker?.terminate();
    this._webGLController?.dispose();
  }

  // Public API
  public async loadArena(config: ArenaConfig): Promise<void> {
    const controller = await this._getWebGLController();
    controller.loadArena(config);
  }
  public async addPlayer(p: PlayerProps): Promise<void> {
    const controller = await this._getWebGLController();
    controller.addPlayer(p);
  }
  public async removePlayer(playerId: string): Promise<void> {
    const controller = await this._getWebGLController();
    controller.removePlayer(playerId);
  }
  public async updatePlayer(p: UpdatePlayerProps): Promise<void> {
    const controller = await this._getWebGLController();
    controller.updatePlayer(p);
  }
  public async triggerPlayerAnimation(p: PlayerAnimationProps): Promise<void> {
    const controller = await this._getWebGLController();
    controller.triggerPlayerAnimation(p);
  }
  public async triggerCrowdAnimationByCategory(
    category: AnimationCategory,
  ): Promise<void> {
    const controller = await this._getWebGLController();
    controller.triggerCrowdAnimationByCategory(category);
  }
  public async triggerPlayerEmoji(p: PlayerEmojiProps): Promise<void> {
    const controller = await this._getWebGLController();
    controller.triggerPlayerEmoji(p);
  }
  public async triggerBooster(p: BoosterProps): Promise<void> {
    const controller = await this._getWebGLController();
    controller.triggerBooster(p);
  }
  public async triggerSelectCard(p: TriggerCardSelectProps): Promise<void> {
    const controller = await this._getWebGLController();
    controller.triggerSelectCard(p);
  }
  public async triggerRequestBooster(p: TriggerRequestBoosterProps): Promise<void> {
    const controller = await this._getWebGLController();
    controller.triggerRequestBooster(p);
  }
  public async setContentMode(contentMode: ContentMode): Promise<void> {
    const controller = await this._getWebGLController();
    controller.setContentMode(contentMode);
  }

  public async setMediaStream(mediaStream: Nullable<MediaStream>): Promise<void> {
    if (MEDIA_STREAM_TRACK_PROCESSOR_SUPPORTED) {
      return this._setMediaStreamTrackProcessor(mediaStream);
    }

    return this._addVideoToOverlay(mediaStream);
  }
  public async setLocalGroupId(groupId: Nullable<string>): Promise<void> {
    const controller = await this._getWebGLController();
    controller.setLocalGroupId(groupId);
  }
  public async setGetAvatarsFunc(
    f: (userIds: string[]) => Promise<Avatar[]>,
  ): Promise<void> {
    const controller = await this._getWebGLController();
    controller.setGetAvatarsFunc(WEBWORKER_SUPPORTED ? Comlink.proxy(f) : f);
  }
  public async setGetArenaFunc(
    f: (id: string) => Promise<ClientSideArena>,
  ): Promise<void> {
    const controller = await this._getWebGLController();
    controller.setGetArenaFunc(WEBWORKER_SUPPORTED ? Comlink.proxy(f) : f);
  }

  public async setGetProfileFunc(f: (userId: string) => Promise<Profile>) {
    const controller = await this._getWebGLController();
    controller.setGetProfileFunc(WEBWORKER_SUPPORTED ? Comlink.proxy(f) : f);
  }

  public async setFirstArenaLoadedFunc(f: () => Promise<void>) {
    const controller = await this._getWebGLController();
    controller.setFirstArenaLoadedFunc(WEBWORKER_SUPPORTED ? Comlink.proxy(f) : f);
  }

  public async setFirstVideoFrameRenderedFunc(f: () => Promise<void>) {
    const controller = await this._getWebGLController();
    controller.setFirstVideoFrameRenderedFunc(WEBWORKER_SUPPORTED ? Comlink.proxy(f) : f);
  }
  public async getSceneStats(): Promise<SceneStats> {
    const controller = await this._getWebGLController();

    const stats = await controller.getSceneStats();

    return stats;
  }
  public async resize(
    width: number,
    height: number,
    devicePixelRatio: number,
  ): Promise<void> {
    const controller = await this._getWebGLController();
    controller.resize(width, height, devicePixelRatio);

    if (this._overlayController) {
      this._overlayController.resize(width, height, devicePixelRatio);
    }
  }
  public async setRenderQualitySettings({
    frameRate,
    shadowType,
    shadowQuality,
    lightingType,
    crowdAnimationRate,
    crowdDetail,
    crowdMode,
    antiAliasing,
  }: RenderQualitySettings): Promise<void> {
    const controller = await this._getWebGLController();
    controller.setRenderQualitySettings({
      frameRate,
      shadowType,
      shadowQuality,
      lightingType,
      crowdAnimationRate,
      crowdDetail,
      crowdMode,
      antiAliasing,
    });
  }
  public async getFrameAnalyticsStats(): Promise<FrameAnalyticsStats> {
    const controller = await this._getWebGLController();

    return await controller.getFrameAnalyticsStats();
  }
  public async setFrameRenderStatsCallback(
    callback: Nullable<FrameRenderStatsCallback>,
  ): Promise<void> {
    const controller = await this._getWebGLController();
    controller.setFrameRenderStatsCallback(callback);
  }
}
