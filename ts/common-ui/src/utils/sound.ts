import { HowlOptions } from 'howler';

import {
  SoundConfig,
  SoundAsset,
  RuntimeSoundAsset,
  MediaErrorCodes,
} from '@common-types';

/**
 * Transform a SoundConfig struct to HowlOptions.
 * NOTE: This is technically not needed yet, but was abstracted for future-proofing purposes.
 * @param config The configuration to use.
 * @returns A howler-compatible options object.
 */
export function soundConfigToHowlOptions(config: SoundConfig): Omit<HowlOptions, 'src'> {
  return {
    volume: config.volume,
  };
}

/**
 * Returns a human-readable reason for the given media error code.
 * @see https://html.spec.whatwg.org/multipage/media.html#mediaerror
 * @param errorCode The MediaErrorCode.
 * @returns The reason for the error, as a string.
 */
export function getMediaErrorCodeReason(errorCode: MediaErrorCodes): string {
  switch (errorCode) {
    case MediaErrorCodes.Aborted:
      return 'Fetching the resource was aborted by user agent';
    case MediaErrorCodes.Network:
      return 'Network error occurred while fetching resource';
    case MediaErrorCodes.Decode:
      return 'Failed to decode the resource';
    case MediaErrorCodes.NotSupported:
    default:
      return 'Resource not supported';
  }
}

/**
 * Merges runtime configs and injects the defaults, returning a config with all properties.
 * @param defaults The default sound config.
 * @param options The runtime sound config.
 */
export function mergeRuntimeConfigs(
  defaults: SoundConfig,
  options?: Partial<SoundConfig>,
): Required<SoundConfig> {
  return {
    stereo: 0,
    loop: false,
    priority: false,
    delay: 0,
    maxLoopDuration: 0,
    range: [-1, -1],
    ...defaults,
    ...(options ?? {}),
  };
}

/**
 * Creates a new SoundAsset with active runtime config instead of default config.
 * @param asset The sound asset.
 * @param runtimeOptions The runtime configuration.
 */
export function makeRuntimeAsset(
  asset: SoundAsset,
  runtimeOptions: Required<SoundConfig>,
): RuntimeSoundAsset {
  // Randomize the levels if set
  const [minRange, maxRange] = runtimeOptions.range;

  if (minRange > -1 && maxRange > -1) {
    runtimeOptions.volume = getRandomVolume(minRange, maxRange);
  }

  return {
    ...asset,
    defaultConfig: runtimeOptions,
  };
}

export function getRandomVolume(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
