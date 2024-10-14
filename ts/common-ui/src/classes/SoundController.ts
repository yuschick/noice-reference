import { makeLoggers, Nullable, repromise } from '@noice-com/utils';
import { EventEmitter } from 'eventemitter3';

import { AudioTrack } from './AudioTrack';
import { LocalUserData } from './LocalUserData';
import { SoundAssetLoader } from './SoundAssetLoader';
import { StreamTrack } from './StreamTrack';

import { CommonUserDataKeys, SoundConfig } from '@common-types';

const { logWarn, logInfo, logInfoVerbose } = makeLoggers('SOUND_CONTROLLER');

const howlerPromise = repromise(() => import('howler'));

interface EventTypes {
  'audio-unlocked': [];
}

export enum AudioTrackTypes {
  Effects,
  Stream,
}

// @todo: ducking
export class SoundController<
  LocalStorageKeys extends CommonUserDataKeys = CommonUserDataKeys,
> extends EventEmitter<EventTypes> {
  private _activeLoader: Nullable<SoundAssetLoader> = null;
  private _effectsTrack: AudioTrack;
  private _streamTrack: StreamTrack;

  private _audioUnlocked = false;
  private _masterVolume = 1;
  private _mute = false;

  private _localUserData: Nullable<LocalUserData<LocalStorageKeys>>;

  constructor() {
    super();

    this._localUserData = null;
    this._effectsTrack = new AudioTrack('Effects');
    this._streamTrack = new StreamTrack();
    this._streamTrack.addListener('video-playing', this._onStreamElementPlay);
  }

  private async _attemptAudioUnlock(): Promise<boolean> {
    if (this._audioUnlocked) {
      return true;
    }

    try {
      const audioNode = new Audio();
      void (await audioNode.play());
      this._onAudioUnlock();
      return true;
    } catch (e) {
      logWarn(`Audio is locked, setting up unlock events. (${e})`);
      this._onAudioLocked();
      document.addEventListener('touchstart', this._onAudioUnlock);
      document.addEventListener('touchend', this._onAudioUnlock);
      document.addEventListener('click', this._onAudioUnlock);
      document.addEventListener('keydown', this._keydownAudioUnlock);
    }

    return false;
  }

  private _keydownAudioUnlock = (event: KeyboardEvent) => {
    // Clicking meta or shift key is not counted as interaction,
    // so sound is not unlocked
    if (event.metaKey || event.shiftKey) {
      return;
    }

    this._onAudioUnlock();
  };

  private _onStreamElementPlay = (element: HTMLVideoElement | HTMLAudioElement) => {
    if (element.muted) {
      this._attemptAudioUnlock();
    } else {
      this._onAudioUnlock();
    }
  };

  private _onAudioLocked = () => {
    this.setMuted(true);
  };

  private _onAudioUnlock = () => {
    this._audioUnlocked = true;
    logInfo('Audio has been successfully unlocked.');
    document.removeEventListener('touchstart', this._onAudioUnlock);
    document.removeEventListener('touchend', this._onAudioUnlock);
    document.removeEventListener('click', this._onAudioUnlock);
    document.removeEventListener('keydown', this._keydownAudioUnlock);
    this.setMuted(this._localUserData?.GetValue('audio.muted') ?? false);
    this.emit('audio-unlocked');
  };

  // Getters / public state access
  public get audioIsUnlocked(): boolean {
    return this._audioUnlocked;
  }

  public set localUserData(localUserData: LocalUserData<LocalStorageKeys>) {
    this._localUserData = localUserData;
  }

  // Volume
  public get effectsVolume(): number {
    return this._effectsTrack.volume;
  }
  public set effectsVolume(value: number) {
    this._effectsTrack.volume = value;
  }

  public get streamVolume(): number {
    return this._streamTrack.volume;
  }
  public set streamVolume(value: number) {
    this._streamTrack.volume = value;
  }

  public async getMasterVolume(): Promise<number> {
    const { Howler } = await howlerPromise;

    // Update howler volume if they are not synced
    const hVolume = Howler.volume();

    if (typeof hVolume === 'number' && hVolume !== this._masterVolume) {
      Howler.volume(this._masterVolume);
    }

    return this._masterVolume;
  }
  public async setMasterVolume(value: number) {
    const { Howler } = await howlerPromise;

    Howler.volume(value);
    this._streamTrack.volumeScale = value;
    this._masterVolume = value;
  }

  // Mute
  public async getMuted(): Promise<boolean> {
    return this._mute;
  }
  public async setMuted(value: boolean) {
    const { Howler } = await howlerPromise;
    this._mute = value;
    Howler.mute(value);
    this._streamTrack.muted = value;
  }

  public async registerActiveLoader(loader: SoundAssetLoader): Promise<void> {
    this._attemptAudioUnlock();

    if (loader === this._activeLoader) {
      return;
    }

    this._activeLoader?.suspend();
    this._activeLoader = null;

    if (!loader.isReady) {
      await loader.load();
    } else {
      if (loader.isSuspended) {
        await loader.reload();
      }
    }

    logInfo(`Loader ${loader.name} loaded and registered as active sound loader.`);
    this._activeLoader = loader;
    this._activeLoader.addListener('audio-unlocked', this._onAudioUnlock);
  }

  /**
   * Unloads the current active sound loader.
   */
  public detachActiveLoader(): void {
    // @todo: This hard-suspend will cause all the sounds to instantly stop. Add cross-fade support!
    this._activeLoader?.suspend();
    this._activeLoader?.removeListener('audio-unlocked', this._onAudioUnlock);
    this._activeLoader = null;
  }

  /**
   * Get one of the audio tracks directly.
   * @param track The audio track to get.
   */
  public getAudioTrack(track: AudioTrackTypes): AudioTrack | StreamTrack {
    switch (track) {
      case AudioTrackTypes.Stream:
        return this._streamTrack;
      case AudioTrackTypes.Effects:
      default:
        return this._effectsTrack;
    }
  }

  public async registerStream(
    stream: MediaStreamTrack,
    el: HTMLVideoElement | HTMLAudioElement,
  ): Promise<void> {
    logInfo(
      `Registering stream audio with stream controller. (${stream.id}: ${stream.label} rendered via ${el})`,
    );
    this._streamTrack.attachStream(stream, el);

    // Auto unmute if we are already unlocked
    if (await this._attemptAudioUnlock()) {
      this._streamTrack.muted = await this.getMuted();
    } else {
      throw new Error('Stream audio could not be unmuted');
    }
  }

  public clearStreams(): void {
    logInfo(`Detaching stream audio from stream controller.`);
    this._streamTrack.detachStream();
  }

  /**
   * Plays sound for the given sound key.
   * @param soundKey The sound key to play.
   * @param opts Optional sound configuration for this instance of the sound.
   * @returns The active sound ID.
   */
  public playSound(soundKey: string, opts?: Partial<SoundConfig>): number {
    const asset = this._activeLoader?.getSound(soundKey);

    if (!asset) {
      logWarn(
        `Attempted to play sound ${soundKey} but it couldn't be found!\n`,
        'This is due to either the sound not being added to the correct loader, or the loader not be activated.',
      );
      return -1;
    }

    logInfoVerbose(`Playing sound ${soundKey} on the effects track.`);
    return this._effectsTrack.playSound(asset, opts);
  }

  /**
   * Stops playback of the given sound key.
   * @param soundId The ID of the playing sound instance.
   */
  public stopSound(soundId: number): void {
    if (soundId === -1) {
      return;
    }

    this._effectsTrack.stopSound(soundId);
  }
}
