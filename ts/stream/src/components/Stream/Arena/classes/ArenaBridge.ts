import { Animation } from '@noice-com/schemas/avatar/animation.pb';
import {
  ArenaConfig,
  AvatarConfigs,
  AvatarConfigsAvatar,
} from '@noice-com/schemas/rendering/config.pb';
import {
  BoosterRequestedEvent,
  BoosterUsedEvent,
  CardSetActiveEvent,
  ChatMessageSentEvent,
  EmojiEvent,
  EmoteEvent,
  GroupCheerEvent,
  MatchEndEvent,
} from '@noice-com/schemas/rendering/events.pb';
import { CameraTransitionRequest } from '@noice-com/schemas/rendering/transitions.pb';
import { Nullable } from '@noice-com/utils'; // TODO figure out if three sha
// eslint-disable-next-line no-restricted-imports
import {
  FrameStats,
  FrameStatsCallback,
  Graphics,
} from '@noice-com/web-renderer/src/legacy/';
import { Arena } from '@noice-com/web-renderer/src/legacy/hierarchy';

import { Stats } from '../hooks/useClientRenderingStats.hook';
import { ScreenParamsCallback } from '../types';

import { ArenaHandler } from './ArenaHandler';

import { RenderQualityProfileSettings } from '@stream-types';

export class ArenaBridge {
  private _graphics: Graphics;
  private _eventHandler: ArenaHandler;
  private _streamReaderAbortController: Nullable<AbortController> = null;
  private _firstVideoRenderedCallback: Nullable<() => void> = null;
  private _screenParamsCallback: Nullable<ScreenParamsCallback> = null;
  private _removeScreenParamsObserver: Nullable<() => void> = null;
  private _eventHandlers: ReturnType<ArenaHandler['getHandlers']>;
  constructor(
    canvas: OffscreenCanvas | HTMLCanvasElement,
    animations: Animation[],
    fallback: boolean,
    featureFlags: { [featureName: string]: string },
  ) {
    const g = new Graphics(canvas, featureFlags, {
      compositor: { usePostProcessMask: true },
      fallback,
    });

    const eventHandler = new ArenaHandler({
      graphics: g,
      animations,
      featureFlags,
    });

    this._graphics = g;
    this._eventHandler = eventHandler;
    this._eventHandlers = eventHandler.getHandlers();
  }

  private _registerScreenParamsCallback(callback: Nullable<ScreenParamsCallback>) {
    this._removeScreenParamsObserver?.();

    const sandbox = this._graphics.getRenderer().sandbox;

    if (!sandbox || !(sandbox instanceof Arena)) {
      return;
    }

    this._removeScreenParamsObserver = sandbox.screenParams.onValue((params) => {
      if (!params) {
        return;
      }

      callback?.({
        x: params.x,
        y: params.y,
        w: params.w,
        h: params.z,
      });
    });
  }

  public setScreenParamsCallback(callback: Nullable<ScreenParamsCallback>) {
    this._screenParamsCallback = callback;
    this._registerScreenParamsCallback(callback);
  }

  public resize(width: number, height: number, devicePixelRatio: number) {
    this._graphics.resize(width, height, devicePixelRatio);
  }

  public setPerformanceProfile({
    frameRate,
    shadowType,
    shadowQuality,
    lightingType,
    crowdAnimationRate,
    crowdDetail,
    crowdResolution,
    crowdMode,
    antiAliasing,
  }: RenderQualityProfileSettings) {
    const { renderQualityObservables } = this._graphics;
    renderQualityObservables.frameRate.value = frameRate;
    renderQualityObservables.shadowType.value = shadowType;
    renderQualityObservables.shadowQuality.value = shadowQuality;
    renderQualityObservables.lightingType.value = lightingType;
    renderQualityObservables.crowdAnimationRate.value = crowdAnimationRate;
    renderQualityObservables.crowdDetail.value = crowdDetail;
    renderQualityObservables.crowdResolution.value = crowdResolution;
    renderQualityObservables.antiAliasing.value = antiAliasing;

    this._eventHandler.crowdMode = crowdMode;
  }
  public setLocalGroupID(localGroupID: string) {
    this._eventHandler.localGroupId = localGroupID;
  }

  public setArenaHidden(hidden: boolean) {
    this._eventHandler.setArenaHidden(hidden);
  }

  public setAvatarOverride(avatarOverrideURL: Nullable<string>) {
    this._eventHandler.avatarOverrideUrl = avatarOverrideURL;
  }

  public setRenderingPaused(paused: boolean) {
    this._graphics.getRenderer().renderingPaused = paused;
  }

  public getStats(): Stats {
    return {
      ...this._graphics.getStats(),
      ...this._eventHandler.consumeMetrics(),
      ...this._graphics.getStreamStats(),
    };
  }

  public setFirstVideoRenderedCallback(cb: () => void) {
    this._firstVideoRenderedCallback = cb;
  }

  public setFrameStatsCallback(cb: Nullable<FrameStatsCallback>) {
    this._graphics.onFrameStats = (ev: FrameStats) => {
      cb && cb(ev);
    };

    this._graphics.setDebug(cb !== null);
  }

  public getGPUType(): string {
    const gl = this._graphics.getRenderer().getGLContext();
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) {
      return 'unknown';
    }

    return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  }

  public setVideoTrackStream(readerableStream: ReadableStream<VideoFrame>) {
    if (this._streamReaderAbortController) {
      this._streamReaderAbortController.abort();
    }

    const abortController = (this._streamReaderAbortController = new AbortController());

    (async () => {
      const reader = readerableStream.getReader();
      while (!abortController.signal.aborted) {
        const { done, value } = await reader.read();
        if (done) {
          return;
        }

        this._eventHandler.updateVideoFrame(value);
        if (this._firstVideoRenderedCallback) {
          this._firstVideoRenderedCallback();
          this._firstVideoRenderedCallback = null;
        }
      }
    })();
  }

  public destruct() {
    this._removeScreenParamsObserver?.();
    this._graphics.destruct();
    this._eventHandler.destroy();
  }

  public async onArenaEvent(event: ArenaConfig, _eventAgeMs: number) {
    await this._eventHandlers.onArenaEvent(event);
    this._registerScreenParamsCallback(this._screenParamsCallback);
  }

  public onAvatarsEvent(event: AvatarConfigs, eventAgeMs: number) {
    this._eventHandlers.onAvatarsEvent(event, eventAgeMs);
  }

  public onCameraTransitionRequest(event: CameraTransitionRequest, eventAgeMs: number) {
    this._eventHandlers.onCameraTransitionRequest(event, eventAgeMs);
  }

  public onEmoteEvent(event: EmoteEvent) {
    this._eventHandlers.onEmoteEvent(event);
  }

  public onEmojiEvent(event: EmojiEvent) {
    this._eventHandlers.onEmojiEvent(event);
  }

  public onCardSetActiveEvent(event: CardSetActiveEvent) {
    this._eventHandlers.onCardSetActiveEvent(event);
  }

  public onBoosterRequestedEvent(event: BoosterRequestedEvent) {
    this._eventHandlers.onBoosterRequestedEvent(event);
  }

  public onBoosterUsedEvent(event: BoosterUsedEvent) {
    this._eventHandlers.onBoosterUsedEvent(event);
  }

  public onChatMessageSentEvent(event: ChatMessageSentEvent) {
    this._eventHandlers.onChatMessageSentEvent(event);
  }

  public onGroupCheerEvent(event: GroupCheerEvent) {
    this._eventHandlers.onGroupCheerEvent(event);
  }

  public onMatchStartEvent() {
    this._eventHandlers.onMatchStartEvent();
  }

  public onMatchEndEvent(event: MatchEndEvent) {
    this._eventHandlers.onMatchEndEvent(event);
  }

  public onAvatarUpdateEvent(event: AvatarConfigsAvatar) {
    this._eventHandlers.onAvatarUpdateEvent(event);
  }
}
