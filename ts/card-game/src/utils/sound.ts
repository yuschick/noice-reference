import { SoundAssetLoader, CommonConfig } from '@noice-com/common-ui';

import { GameSoundKeys } from '@game-types';

export function getGameSoundConfig(loader: SoundAssetLoader): void {
  CommonConfig.addCommonSoundConfig(loader);
  loader.config({
    [GameSoundKeys.BoostersActivateDoubt]: { volume: 0 },
    [GameSoundKeys.BoostersActivateScavenge]: { volume: 0 },
    [GameSoundKeys.BoostersActivateSpeedUp]: { volume: 0 },
    [GameSoundKeys.BoostersReceive]: { volume: 0.2 },
    [GameSoundKeys.BoostersSelectionModeCancel]: { volume: 0.15 },
    [GameSoundKeys.BoostersSelectionModeLoop]: { volume: 0.15, loop: true },
    [GameSoundKeys.BoostersSelectionModeStart]: { volume: 0.15 },
    [GameSoundKeys.BoostersTeamReceive]: { volume: 0.2, stereo: 0.75 }, // has not been refined
    [GameSoundKeys.BoostersTeamUse]: { volume: 0.2, stereo: 0.75, range: [0.18, 0.23] }, // Request Booster
    [GameSoundKeys.BoostersUse]: { volume: 0.2 },
    [GameSoundKeys.CardsAonCloseToSucceeding]: { volume: 0.25 },
    [GameSoundKeys.CardsAonCountDown]: { volume: 0.25 },
    [GameSoundKeys.CardsAonDoubleDown]: { volume: 0.25 },
    [GameSoundKeys.CardsDeal]: { volume: 0.1 },
    [GameSoundKeys.CardHover]: { volume: 0.15 },
    [GameSoundKeys.CardsMaxPoints]: { volume: 0.5 }, // has not been refined
    [GameSoundKeys.CardsProgress]: { volume: 0.5 }, // has not been refined
    [GameSoundKeys.CardsSelect]: { volume: 0.15 }, // has not been refined
    [GameSoundKeys.CardsSwitchOut]: { volume: 0.2 }, // has not been refined
    [GameSoundKeys.DealingCards]: { volume: 0.5 }, // has not been refined
    [GameSoundKeys.PlayerCardSucceeds]: { volume: 0.4, stereo: -0.5 }, // has not been refined
    [GameSoundKeys.PlayerCardFailed]: { volume: 0.2, stereo: -0.5 },
    [GameSoundKeys.PlayerOpenCardSelection]: { volume: 0.15 }, // has not been refined
    [GameSoundKeys.PlayerUseReshuffleToken]: { volume: 0.35, range: [0.3, 0.35] }, // has not been refined
    [GameSoundKeys.ScoringBoosterBonus]: { volume: 0.5 }, // has not been refined
    [GameSoundKeys.ScoringCardSucceeds]: { volume: 0.5 }, // has not been refined
    [GameSoundKeys.ScoringPlayerNewBestPlay]: { volume: 0.5 }, // has not been refined
    [GameSoundKeys.ScoringPlayerScoreTickingUp]: { volume: 0.5 }, // has not been refined
    [GameSoundKeys.TeammateCardFailed]: { volume: 0.2, stereo: 0.5 }, // has not been refined
    [GameSoundKeys.TeammateCardSucceeds]: { volume: 0.2, stereo: 0.5 }, // has not been refined
    [GameSoundKeys.TeammateJoined]: { volume: 0.4 },
    [GameSoundKeys.TeammateLeft]: { volume: 0.4 },
  });
}

export async function getGameSounds(loader: SoundAssetLoader): Promise<void> {
  const [game] = await Promise.all([
    import('@game-assets/audio/assets'),
    CommonConfig.addCommonSounds(loader),
  ]);

  loader.add(GameSoundKeys.BoostersActivateDoubt, game.BoostersActivateDoubt);
  loader.add(GameSoundKeys.BoostersActivateScavenge, game.BoostersActivateScavenge);
  loader.add(GameSoundKeys.BoostersActivateSpeedUp, game.BoostersActivateSpeedUp);
  loader.add(GameSoundKeys.BoostersReceive, game.BoostersReceive);
  loader.add(GameSoundKeys.BoostersSelectionModeCancel, game.BoostersSelectionModeCancel);
  loader.add(GameSoundKeys.BoostersSelectionModeLoop, game.BoostersSelectionModeLoop);
  loader.add(GameSoundKeys.BoostersSelectionModeStart, game.BoostersSelectionModeStart);
  loader.add(GameSoundKeys.BoostersTeamReceive, game.BoostersTeamReceive);
  loader.add(GameSoundKeys.BoostersTeamUse, game.BoostersTeamUse);
  loader.add(GameSoundKeys.BoostersUse, game.BoostersUse);
  loader.add(GameSoundKeys.CardsAonCloseToSucceeding, game.CardsAonCloseToSucceeding);
  loader.add(GameSoundKeys.CardsAonCountDown, game.CardsAonCountDown);
  loader.add(GameSoundKeys.CardsAonDoubleDown, game.CardsAonDoubleDown);
  loader.add(GameSoundKeys.CardsDeal, game.CardsDeal);
  loader.add(GameSoundKeys.CardsMaxPoints, game.CardsMaxPoints);
  loader.add(GameSoundKeys.CardsProgress, game.CardsProgress);
  loader.add(GameSoundKeys.CardsSelect, game.CardsSelect);
  loader.add(GameSoundKeys.CardsSwitchOut, game.CardsSwitchOut);
  loader.add(GameSoundKeys.DealingCards, game.DealingCards); // Conflict with CardsDeal?
  loader.add(GameSoundKeys.PlayerCardSucceeds, game.PlayerCardSucceeds);
  loader.add(GameSoundKeys.PlayerCardFailed, game.CardsTeammateFail); // Don't have a sound, using teammate version
  loader.add(GameSoundKeys.PlayerOpenCardSelection, game.PlayerOpenCardSelection);
  loader.add(GameSoundKeys.PlayerUseReshuffleToken, game.PlayerUseReshuffleToken);
  loader.add(GameSoundKeys.ScoringBoosterBonus, game.ScoringBoosterBonus);
  loader.add(GameSoundKeys.ScoringCardSucceeds, game.ScoringCardSucceeds); // conflict with PlayerCardSucceeds ?
  loader.add(GameSoundKeys.ScoringPlayerNewBestPlay, game.ScoringPlayerNewBestPlay);
  loader.add(GameSoundKeys.ScoringPlayerScoreTickingUp, game.ScoringPlayerScoreTickingUp);
  loader.add(GameSoundKeys.TeammateCardFailed, game.CardsTeammateFail);
  loader.add(GameSoundKeys.TeammateCardSucceeds, game.PlayerCardSucceeds); // Don't have a sound, using player cards for now
  loader.add(GameSoundKeys.TeammateJoined, game.SocialPlayerJoinsGroup);
  loader.add(GameSoundKeys.TeammateLeft, game.SocialPlayerLeavesGroup);
  loader.add(GameSoundKeys.SocialCheerClick, game.SocialCheerClickPlayer);
  loader.add(GameSoundKeys.SocialCheerTeammateClick, game.SocialCheerClickTeam);
  loader.add(GameSoundKeys.SocialCheerPrompt, game.SocialCheerPrompt);
  loader.add(GameSoundKeys.SocialCheerConfirm, game.SocialCheerConfirm);
  loader.add(GameSoundKeys.SocialCheerFail, game.SocialCheerFail);
}
