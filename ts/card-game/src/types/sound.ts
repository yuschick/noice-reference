import { CommonSoundKeys } from '@noice-com/common-ui';

export enum GameOnlySoundKeys {
  // Boosters
  BoostersActivateDoubt = 'BoostersActivateDoubt',
  BoostersActivateScavenge = 'BoostersActivateScavenge',
  BoostersActivateSpeedUp = 'BoostersActivateSpeedUp',
  BoostersReceive = 'BoostersReceive',
  BoostersSelectionModeCancel = 'BoostersSelectionModeCancel',
  BoostersSelectionModeLoop = 'BoostersSelectionModeLoop',
  BoostersSelectionModeStart = 'BoostersSelectionModeStart',
  BoostersTeamReceive = 'BoostersTeamReceive',
  BoostersTeamUse = 'BoostersTeamUse',
  BoostersUse = 'BoostersUse',

  // Cards
  CardsAonCloseToSucceeding = 'CardsAonCloseToSucceeding',
  CardsAonCountDown = 'CardsAonCountDown',
  CardsAonDoubleDown = 'CardsAonDoubleDown',
  CardsDeal = 'CardsDeal',
  CardsMaxPoints = 'CardsMaxPoints',
  CardsProgress = 'CardsProgress',
  CardsSelect = 'CardsSelect',
  CardsSwitchOut = 'CardsSwitchOut',
  DealingCards = 'DealingCards',

  // Player
  PlayerCardSucceeds = 'PlayerCardSucceeds',
  PlayerCardFailed = 'PlayerCardFailed',
  PlayerOpenCardSelection = 'PlayerOpenCardSelection',
  PlayerUseReshuffleToken = 'PlayerUseReshuffleToken',

  // Scoring
  ScoringBoosterBonus = 'ScoringBoosterBonus',
  ScoringCardSucceeds = 'ScoringCardSucceeds',
  ScoringPlayerNewBestPlay = 'ScoringPlayerNewBestPlay',
  ScoringPlayerScoreTickingUp = 'ScoringPlayerScoreTickingUp',

  // Social
  TeammateCardSucceeds = 'TeammateCardSucceeds',
  TeammateCardFailed = 'TeammateCardFailed',
  TeammateJoined = 'TeammateJoined',
  TeammateLeft = 'TeammateLeft',

  // Social cheer
  SocialCheerClick = 'SocialCheerClick',
  SocialCheerTeammateClick = 'SocialCheerTeammateClick',
  SocialCheerConfirm = 'SocialCheerConfirm',
  SocialCheerFail = 'SocialCheerFail',
  SocialCheerPrompt = 'SocialCheerPrompt',
}

// merge enums
export type GameSoundKeys = GameOnlySoundKeys | CommonSoundKeys;
export const GameSoundKeys = { ...GameOnlySoundKeys, ...CommonSoundKeys };
