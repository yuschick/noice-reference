import { Howl } from 'howler';

// @todo: Add looping support
export interface SoundConfig {
  /** Default volume for the sound. */
  volume: number;
  /** Whether to pan the audio to the left or right. -1 = left, 0 = middle, 1 = right  */
  stereo?: number;
  /** Whether or not this sound should be prioritized whenever multiple sounds are played at once. */
  priority?: boolean;
  /** Whether or not this sound should loop. */
  loop?: boolean;
  /** Optional min-max volume range to randomize the sound every play.  */
  range?: [min: number, max: number];
  /** Optional delay to the start of the sound */
  delay?: number;
  /** Max ms duration to run the loop */
  maxLoopDuration?: number;
}

export interface SoundAsset<ConfigType extends SoundConfig = SoundConfig> {
  instance: Howl;
  soundKey: string;
  defaultConfig: ConfigType;
}

export type RuntimeSoundAsset = SoundAsset<Required<SoundConfig>>;

export enum CommonSoundKeys {
  // General interactions
  GenericHover = 'GenericHover',
  CardHover = 'CardHover',
  ButtonClickConfirm = 'ButtonClickConfirm',
  ButtonClickCancel = 'ButtonClickCancel',
  NotificationDing = 'NotificationDing',
  NotificationDingImportant = 'NotificationDingImportant',
  NotificationPlatform = 'NotificationPlatform',
  MenuOpen = 'MenuOpen',
  MenuClose = 'MenuClose',
  RankUp = 'RankUp',

  // Misc
  CurrencyCountDown = 'CurrencyCountDown',
  CurrencyCoinCountUp = 'CurrencyCountUp',
  CurrencyCoinReward = 'CurrencyCoinReward',
  CurrencyXpCountUp = 'CurrencyXpCountUp',
  CurrencyXpCountUpEnd = 'CurrencyXpCountUpEnd',
  GenericAttention = 'GenericAttention',
  AssetReveal = 'AssetReveal',

  // Progression
  ProgressionCardDuplicateValueUp = 'ProgressionCardDuplicateValueUp',
  ProgressionCardLevelUp = 'ProgressionCardLevelUp',
  ProgressionCardUnlocked = 'ProgressionCardUnlocked',

  // Scoring
  ScoringCardSucceedsVariation = 'PlayerCardSucceedsVariation',
}
