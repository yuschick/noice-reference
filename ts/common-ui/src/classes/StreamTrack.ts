import { Nullable } from '@noice-com/utils';
import { EventEmitter } from 'eventemitter3';

interface EventTypes {
  'video-playing': [element: HTMLVideoElement | HTMLAudioElement];
}

export class StreamTrack extends EventEmitter<EventTypes> {
  public readonly name = 'Stream';

  private _volumeScale = 1;
  private _volume = 1;
  private _muted = false;
  private _stream: Nullable<MediaStreamTrack> = null;
  private _streamEl: Nullable<HTMLVideoElement | HTMLAudioElement> = null;

  // This is here so that we don't double-report global volume changes.
  private _scaledVolumeChange = false;

  public get volumeScale(): number {
    return this._volumeScale;
  }
  public set volumeScale(value: number) {
    this._volumeScale = value;
    this._scaledVolumeChange = true;
    // Call volume to apply the changes.
    this.volume = this._volume;
  }

  public get volume(): number {
    return this._volume;
  }
  public set volume(value: number) {
    this._volume = value;

    if (!this._scaledVolumeChange) {
      this._scaledVolumeChange = false;
    }

    if (this._streamEl) {
      this._streamEl.volume = value * this._volumeScale;
    }
  }

  public get muted(): boolean {
    return this._muted;
  }
  public set muted(value: boolean) {
    // if (this._stream) this._stream.enabled = value;
    this._muted = value;

    if (this._streamEl) {
      this._streamEl.muted = value;
    }
  }

  constructor() {
    super();
  }

  private _onElementPlays = () => {
    if (!this._streamEl) {
      return;
    }

    this.emit('video-playing', this._streamEl);
  };

  public detachStream(): void {
    this._stream?.stop();
    this._stream = null;
    this._streamEl?.removeEventListener('play', this._onElementPlays);
    this._streamEl = null;
  }

  public attachStream(
    stream: MediaStreamTrack,
    element: HTMLVideoElement | HTMLAudioElement,
  ): void {
    this.detachStream();
    this._stream = stream;
    this._streamEl = element;
    this._streamEl.addEventListener('play', this._onElementPlays);

    this._streamEl.volume = this._volume * this.volumeScale;
    this._streamEl.muted = this._muted;
  }
}
