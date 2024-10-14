import * as THREE from 'three';

import {
  FRAME_LIMITER_FREQUENCY,
  FRAME_LIMITER_THRESHOLD,
  TARGET_BASELINE_FRAMES_PER_SECOND,
} from '../constants';

import { RendererFlags } from 'renderer/data/types';

export class FrameClock {
  private _clock: THREE.Clock;
  private _renderClock: THREE.Clock;
  private _presentsMissed: number[];
  private _rendererFlags: RendererFlags;

  private _targetFramesPerSecond = TARGET_BASELINE_FRAMES_PER_SECOND;
  public get targetFramesPerSecond() {
    return this._targetFramesPerSecond;
  }
  public set targetFramesPerSecond(value) {
    this._targetFramesPerSecond = value;
  }

  private _targetSettingsFramesPerSecond = TARGET_BASELINE_FRAMES_PER_SECOND;
  public get targetSettingsFramesPerSecond() {
    return this._targetSettingsFramesPerSecond;
  }
  public set targetSettingsFramesPerSecond(value) {
    this._targetSettingsFramesPerSecond = value;
  }

  private _deltaTime = 0;
  public get deltaTime() {
    return this._deltaTime;
  }
  public set deltaTime(value) {
    this._deltaTime = value;
  }

  private _frameDelta = 0;
  public get frameDelta(): number {
    return this._frameDelta;
  }

  private _renderTime = 0;
  public get renderTime(): number {
    return this._renderTime;
  }

  private _frameLimiterTimer = 0;
  public get frameLimiterTimer(): number {
    return this._frameLimiterTimer;
  }

  public get targetFrameTime() {
    return 1 / this.targetFramesPerSecond;
  }

  public get shouldRenderFrame(): boolean {
    return this._frameDelta > this.targetFrameTime;
  }

  constructor(flags: RendererFlags) {
    this._rendererFlags = flags;
    this._clock = new THREE.Clock();
    this._renderClock = new THREE.Clock();
    this._presentsMissed = [];
  }

  private calculateTargetFps() {
    // If the percentage of frames that missed the 0.016ms is higher than threshold
    // We engage the limiter at 30FPS instead of 60.
    const averagePresentsMissed =
      this._presentsMissed.reduce((acc, c) => acc + c, 0) / this._presentsMissed.length;

    if (averagePresentsMissed >= FRAME_LIMITER_THRESHOLD) {
      this.targetFramesPerSecond = Math.min(30, this.targetSettingsFramesPerSecond);
    } else {
      this.targetFramesPerSecond = Math.min(60, this.targetSettingsFramesPerSecond);
    }
  }

  public onPreRender(): void {
    const delta = this._clock.getDelta();
    this._frameDelta += delta;
    this._deltaTime += delta;

    if (this.shouldRenderFrame) {
      this._renderClock.start();
    }

    this._presentsMissed.push(delta > 0.017 ? 1 : 0);

    // Track the last time we updated the frame limiter
    // If this value is above the frequency we update the target FPS
    this._frameLimiterTimer += delta;
    if (this._frameLimiterTimer >= FRAME_LIMITER_FREQUENCY) {
      if (this._rendererFlags.useDynamicFrameLimiter) {
        this.calculateTargetFps();
      } else {
        this.targetFramesPerSecond = this.targetSettingsFramesPerSecond;
      }

      this._presentsMissed = [];
      this._frameLimiterTimer = 0;
    }
  }

  public onPostRender(): void {
    this._frameDelta = this._frameDelta % this.targetFrameTime;
    this._renderTime = this._renderClock.getDelta();
  }

  public dispose(): void {
    this._presentsMissed = [];
  }
}
