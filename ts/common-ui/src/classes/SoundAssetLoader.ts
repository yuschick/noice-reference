import { makeLoggers, repromise } from '@noice-com/utils';
import { EventEmitter } from 'eventemitter3';
import { Howl } from 'howler';

import { SoundConfig, SoundAsset, MediaErrorCodes } from '@common-types';
import { getMediaErrorCodeReason, soundConfigToHowlOptions } from '@common-utils';

const howlerPromise = repromise(() => import('howler'));

const { logWarn, logError, logInfo, logInfoVerbose } = makeLoggers('SOUND_LOADER');

interface EventTypes {
  'audio-unlocked': [];
}

interface QueueSound {
  name: string;
  sources: string[];
  config: SoundConfig;
}

const DefaultConfig: SoundConfig = {
  volume: 0.5,
  stereo: 0,
  priority: false,
};

// @todo Currently the sound keys are typed just as a string, better
// would be the class to receive the keys type as generic that at least
// extends common sound keys
export class SoundAssetLoader extends EventEmitter<EventTypes> {
  public readonly name: string;

  private _configMap = new Map<string, SoundConfig>();
  private _loadQueue: QueueSound[] = [];
  private _loadedSoundMap = new Map<string, SoundAsset>();

  // Loading state
  private _ready = false;
  private _loading = false;
  private _loadedSounds = 0;
  private _suspended = false;
  private _unlocked = false;

  constructor(name: string) {
    super();

    this.name = name;
  }

  /**
   * True if the loader has been configured and loaded.
   */
  public get isReady(): boolean {
    return this._ready;
  }

  /**
   * True if the loader has been suspended.
   */
  public get isSuspended(): boolean {
    return this._suspended;
  }

  private async _loadSingleAsset({ config, sources }: QueueSound): Promise<Howl> {
    const { Howl } = await howlerPromise;

    return new Promise((resolve, reject) => {
      const sound = new Howl({
        ...soundConfigToHowlOptions(config),
        src: sources,
        onload() {
          sound.stereo(config.stereo ?? 0);
          resolve(sound);
        },
        onunlock: () => {
          if (this._unlocked) {
            return;
          }

          this._unlocked = true;
          this.emit('audio-unlocked');
        },
        // @ts-expect-error Howl has incorrectly typed error, but the docs state this will be a number adhering to Media Error codes.
        onloaderror(_, error: MediaErrorCodes) {
          reject(error);
        },
      });
    });
  }

  /**
   * Loads all registered assets and stores them within the loader.
   *
   * @returns Resolves once all assets have been loaded.
   */
  public async load(): Promise<void> {
    if (this._ready) {
      logWarn(
        'Attempted to load SoundLoader but it is already loaded!\n',
        'This indicates the loading module has been incorrectly called more than once.',
      );
      return;
    }

    if (this._loadQueue.length === 0) {
      logWarn(
        `SoundLoader ${this.name} attempted to load before having any sounds assigned!\n`,
        'This can happen if the gets initialized but not activated. Ignoring.',
      );
      return;
    }

    // Reset state
    this._loading = true;
    this._ready = false;
    this._loadedSounds = 0;

    const queue = this._loadQueue.splice(0, this._loadQueue.length);
    const totalSoundCount = queue.length;
    const loadPromises: Promise<void>[] = [];

    logInfo(`Loading ${totalSoundCount} sounds into SoundLoader ${this.name}`);

    for (const asset of queue) {
      // We use a normal promise here so that we can try to load as many of these in parallel as possible.
      const loadPromise = this._loadSingleAsset(asset)
        .then((sound) => {
          this._loadedSoundMap.set(asset.name, {
            instance: sound,
            soundKey: asset.name,
            defaultConfig: asset.config,
          });
          return;
        })
        .catch((reason: MediaErrorCodes) => {
          logError(
            `Sound ${
              asset.name
            } could not be loaded due to error: ${getMediaErrorCodeReason(
              reason,
            )} (${reason})`,
          );
        })
        .finally(() => {
          this._loadedSounds++;
          const loadedPercent = (this._loadedSounds / totalSoundCount) * 100;
          logInfoVerbose(
            `Loaded ${asset.name}. (${
              this._loadedSounds
            }/${totalSoundCount}, ${loadedPercent.toFixed(2)}%)`,
          );
        });

      loadPromises.push(loadPromise);
    }

    await Promise.allSettled(loadPromises);
    this._ready = true;
    this._loading = false;
  }

  /**
   * Unloads all sounds managed by this loader. Sounds can be used again after via `.reload()`
   * @todo: Is this needed?
   * @see SoundAssetLoader.reload()
   */
  public suspend(): void {
    if (!this._ready || this._suspended) {
      logWarn(
        'Attempting to suspend an already suspended or not prepared loader! Exiting.',
      );
      return;
    }

    logInfo(`Loader ${this.name} suspending.`);
    this._suspended = true;
    this._loadedSoundMap.forEach((asset) => {
      asset.instance.unload();
      asset.instance.off('load');
      asset.instance.off('loaderror');
    });
  }

  /**
   * Reloads the sound files for this loader after being suspended via .suspend().
   * @todo: Is this needed?
   * @see SoundAssetLoader.suspend()
   * @returns A promise resolving when all sounds are loaded again.
   */
  public async reload(): Promise<void> {
    if (!this._suspended) {
      logWarn('Attempting to reload an already active loader! Exiting.');
      return;
    }

    logInfo(`Reloading loader ${this.name}.`);
    const loadedPromises: Promise<void>[] = [];
    this._loadedSoundMap.forEach(
      (asset, name) =>
        new Promise<void>((resolve) => {
          asset.instance.load();
          asset.instance.once('load', () => resolve());
          asset.instance.once('loaderror', (err) => {
            logError(
              `Sound ${name} could not be loaded due to error: ${getMediaErrorCodeReason(
                err,
              )} (${err})`,
            );
            resolve();
          });
        }),
    );

    await Promise.allSettled(loadedPromises);
    logInfo(`Loader ${this.name} reload complete.`);
  }

  /**
   * Get the loaded sound asset for a given sound key.
   * @param soundKey The sound key to get an asset for.
   * @returns The loaded sound, or null if it does not exist.
   */
  public getSound(soundKey: string): SoundAsset | null {
    return this._loadedSoundMap.get(soundKey) ?? null;
  }

  /**
   * Add a sound to this loader.
   * @param soundKey The sound key to register.
   * @param sources Paths to the source files. (recommended webm, mp3)
   * @param config Optionally set the default config for the sound.
   */
  public add(soundKey: string, sources: string[], config = DefaultConfig): void {
    if (this._loading) {
      return;
    }

    const cfg = this._configMap.get(soundKey) ?? config;

    if (!this._configMap.has(soundKey)) {
      this._configMap.set(soundKey, config);
    }

    this._loadQueue.push({
      sources,
      name: soundKey,
      config: cfg,
    });
  }

  /**
   * Set a full config for this sound loader instance.
   * HUOM! You don't have to include all keys, but it is highly recommended that you do!
   * Not sure if you are missing some? Remove the `?` after [key in Soundkeys] to find out.
   * @param cfg The configuration object to use.
   */
  public config(cfg: { [key in string]?: SoundConfig }): void {
    if (this._loading) {
      return;
    }

    const keys = Object.keys(cfg) as string[];
    keys.forEach((soundKey) => {
      if (!cfg[soundKey]) {
        return;
      }

      this._configMap.set(soundKey, cfg[soundKey] as SoundConfig);
    });
  }

  /**
   * Set the config for an individual sound key.
   * @param soundKey The key.
   * @param opts The default configuration for the sound.
   */
  public setKeyConfig(soundKey: string, opts: SoundConfig): void {
    if (this._loading) {
      return;
    }

    this._configMap.set(soundKey, opts);
  }
}
