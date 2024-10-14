import { makeLoggers } from '@noice-com/utils';
import { EventEmitter } from 'eventemitter3';

import {
  SoundConfig,
  SoundAsset,
  RuntimeSoundAsset,
  MediaErrorCodes,
} from '@common-types';
import {
  mergeRuntimeConfigs,
  makeRuntimeAsset,
  getMediaErrorCodeReason,
} from '@common-utils';

const { logWarn } = makeLoggers('AudioTrack');

// @todo: This should be dynamic based on the sound being played.
const DUCK_TARGET = 0.3;

function scaleVolume(base: number, target: number): number {
  return base * target;
}

interface EventTypes {
  'sound-finished': [soundId: number, asset: RuntimeSoundAsset];
}

export class AudioTrack extends EventEmitter<EventTypes> {
  public readonly name: string;

  private _muted = false;
  private _volume = 1;
  private _preMuteVolume = 1;
  private _duckingActive = false;
  private _activeSounds: [number, RuntimeSoundAsset][] = [];

  public get muted(): boolean {
    return this._muted;
  }
  public set muted(value: boolean) {
    // Explicit to prevent confusion.
    if (value === true) {
      this._preMuteVolume = this._volume;
      this.volume = 0;
    } else {
      this.volume = this._preMuteVolume;
    }

    this._muted = value;
  }

  public get volume(): number {
    return this._volume;
  }
  public set volume(value: number) {
    // @todo: clamp this
    this._volume = value;

    if (!this._duckingActive) {
      this._updateActiveSoundVolumes();
    }

    // Unmute when changing
    if (this._muted) {
      this._muted = false;
    }
  }

  constructor(trackName: string) {
    super();

    this.name = trackName;
  }

  /**
   * Removes the given active sound.
   * @param soundId The ID of the sound.
   */
  private _clearActiveSound(soundId: number): void {
    const filtered = [...this._activeSounds].filter(([id]) => soundId !== id);
    this._activeSounds = filtered;
  }

  /**
   * Updates all active sounds to match the current set volume.
   * If ducking is active, will set sounds to the ducking target.
   * @param ignoreImportant If true, will ignore priority sounds (for ducking).
   */
  private _updateActiveSoundVolumes(ignoreImportant = false): void {
    for (const [soundId, asset] of this._activeSounds) {
      if (asset.defaultConfig.priority && ignoreImportant) {
        continue;
      }

      const newVolume = scaleVolume(
        this._volume,
        this._duckingActive ? DUCK_TARGET : asset.defaultConfig.volume,
      );
      asset.instance.volume(newVolume, soundId);
    }
  }

  /**
   * Plays the given sound asset.
   * @param asset The sound asset to play.
   * @param config An optional configuration object to customize this instance.
   * @returns The ID of the sound instance.
   */
  public playSound<AssetType extends SoundAsset = SoundAsset>(
    asset: AssetType,
    config?: Partial<SoundConfig>,
  ): number {
    const { instance, defaultConfig } = asset;

    const { delay = 0, maxLoopDuration, ...configOpts } = config ?? {};
    const cfg = mergeRuntimeConfigs(defaultConfig, configOpts);
    const runtimeAsset = makeRuntimeAsset(asset, cfg);

    // Duck any other playing sounds
    if (cfg.priority) {
      this._duckingActive = true;
      this._updateActiveSoundVolumes(true);
    }

    const soundId = instance.play();

    // Scale the volume of the sound to the current track setting
    instance.volume(scaleVolume(this._volume, cfg.volume), soundId);
    instance.stereo(cfg.stereo, soundId);
    instance.loop(cfg.loop, soundId);

    // If delayed, pause it immediately and set a timeout to resume.
    // This allows us to still pass/use the soundId around, allowing us to stop the sound when needed.
    if (delay > 0) {
      instance.pause(soundId);
      setTimeout(() => instance.play(soundId), delay);
    }

    if (maxLoopDuration) {
      setTimeout(() => instance.stop(soundId), delay + maxLoopDuration);
    }

    // Store the sound until we're done
    this._activeSounds.push([soundId, runtimeAsset]);

    // Subscribe for cleanup events
    instance.once(
      'end',
      () => {
        // Early-out if this is a looping sound.
        if (cfg.loop) {
          return;
        }

        // Cleanup
        this._clearActiveSound(soundId);

        if (cfg.priority) {
          this._duckingActive = false;
          this._updateActiveSoundVolumes(false);
        }

        this.emit('sound-finished', soundId, runtimeAsset);
      },
      soundId,
    );
    instance.once(
      'playerror',
      // @ts-expect-error Howls exported types are incorrect, this function is correctly typed.
      (_, error: MediaErrorCodes) => {
        logWarn(`Could not play sound due to error: ${getMediaErrorCodeReason(error)}`);
        instance.off('end', undefined, soundId);
        this._clearActiveSound(soundId);
      },
      soundId,
    );

    return soundId;
  }

  /**
   * Stops the given sound.
   * @param soundId The ID of the sound to stop.
   */
  public stopSound(soundId: number): void {
    const runtime = this._activeSounds.find(([id]) => id === soundId);

    if (!runtime) {
      return;
    }

    const [id, asset] = runtime;
    asset.instance.stop(id);
    this._clearActiveSound(id);
  }

  /**
   * Stops all sounds playing in this track.
   */
  public stopAll(): void {
    for (const [soundId, asset] of this._activeSounds) {
      asset.instance.stop(soundId);
    }

    this._activeSounds.splice(0, this._activeSounds.length);
  }
}
