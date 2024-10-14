import { SoundAssetLoader } from '@common-classes';
import { CommonSoundKeys } from '@common-types';

export function addCommonSoundConfig(loader: SoundAssetLoader): void {
  loader.config({
    [CommonSoundKeys.ButtonClickCancel]: { volume: 0.5 }, // has not been refined
    [CommonSoundKeys.ButtonClickConfirm]: { volume: 0.5 }, // has not been refined
    [CommonSoundKeys.CardHover]: { volume: 0.1 },
    [CommonSoundKeys.CurrencyCountDown]: { volume: 0.5 }, // has not been refined
    [CommonSoundKeys.CurrencyCoinCountUp]: { volume: 0.5 }, // has not been refined
    [CommonSoundKeys.CurrencyXpCountUp]: { volume: 0.2 },
    [CommonSoundKeys.CurrencyXpCountUpEnd]: { volume: 0.2 },
    [CommonSoundKeys.GenericAttention]: { volume: 0.3 }, // has not been refined
    [CommonSoundKeys.GenericHover]: { volume: 0.0175 },
    [CommonSoundKeys.MenuClose]: { volume: 0.2 },
    [CommonSoundKeys.MenuOpen]: { volume: 0.2 },
    [CommonSoundKeys.NotificationDing]: { volume: 0.2 },
    [CommonSoundKeys.NotificationDingImportant]: { volume: 0.3, priority: true },
    [CommonSoundKeys.NotificationPlatform]: { volume: 0.5 }, // has not been refined
    [CommonSoundKeys.ProgressionCardDuplicateValueUp]: { volume: 0.1 },
    [CommonSoundKeys.ProgressionCardLevelUp]: { volume: 0.25 },
    [CommonSoundKeys.ProgressionCardUnlocked]: { volume: 0.5 }, // has not been refined
    [CommonSoundKeys.RankUp]: { volume: 0.25 },
    [CommonSoundKeys.AssetReveal]: { volume: 0.15 },
    [CommonSoundKeys.ScoringCardSucceedsVariation]: { volume: 0.2 },
  });
}

export async function addCommonSounds(loader: SoundAssetLoader): Promise<void> {
  const core = await import('@noice-com/assets-core/src/audio');

  loader.add(CommonSoundKeys.ButtonClickCancel, core.ButtonClickCancel);
  loader.add(CommonSoundKeys.ButtonClickConfirm, core.ButtonClickConfirm);
  loader.add(CommonSoundKeys.CardHover, core.CardHover);
  loader.add(CommonSoundKeys.CurrencyCountDown, core.CurrencyCoinCountDown);
  loader.add(CommonSoundKeys.CurrencyCoinCountUp, core.CurrencyCoinCountUp);
  loader.add(CommonSoundKeys.CurrencyCoinReward, core.CurrencyCoinReward);
  loader.add(CommonSoundKeys.CurrencyXpCountUp, core.CurrencyXpCountUp);
  loader.add(CommonSoundKeys.CurrencyXpCountUpEnd, core.CurrencyXpCountUpEnd);
  loader.add(CommonSoundKeys.GenericAttention, core.GenericAttention);
  loader.add(CommonSoundKeys.GenericHover, core.GenericHover);
  loader.add(CommonSoundKeys.MenuClose, core.MenuClose);
  loader.add(CommonSoundKeys.MenuOpen, core.MenuOpen);
  loader.add(CommonSoundKeys.NotificationDing, core.NotificationDing);
  loader.add(CommonSoundKeys.NotificationDingImportant, core.NotificationDingImportant);
  loader.add(CommonSoundKeys.NotificationPlatform, core.NotificationPlatform);
  loader.add(
    CommonSoundKeys.ProgressionCardDuplicateValueUp,
    core.ProgressionCardDuplicateValueUp,
  );
  loader.add(CommonSoundKeys.ProgressionCardLevelUp, core.ProgressionCardLevelUp);
  loader.add(CommonSoundKeys.ProgressionCardUnlocked, core.ProgressionCardUnlocked);
  loader.add(CommonSoundKeys.RankUp, core.RankUp);
  loader.add(
    CommonSoundKeys.ScoringCardSucceedsVariation,
    core.ScoringCardSucceedsVariation,
  );
  loader.add(CommonSoundKeys.AssetReveal, core.AssetReveal);
}
