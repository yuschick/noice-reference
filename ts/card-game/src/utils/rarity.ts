import { Rarity } from '@noice-com/schemas/rarity/rarity.pb';
import { Nullable } from '@noice-com/utils';

import { RarityRarity } from '@game-gen';

// @todo: It's not nice, but we have to do this until we get rid of
// all transforms etc.
export function convertRarityRarityToRarity(rarity: Nullable<RarityRarity>) {
  if (!rarity) {
    return Rarity.RARITY_UNSPECIFIED;
  }

  switch (rarity) {
    case RarityRarity.RarityCommon:
      return Rarity.RARITY_COMMON;
    case RarityRarity.RarityUncommon:
      return Rarity.RARITY_UNCOMMON;
    case RarityRarity.RarityRare:
      return Rarity.RARITY_RARE;
    case RarityRarity.RarityEpic:
      return Rarity.RARITY_EPIC;
    case RarityRarity.RarityLegendary:
      return Rarity.RARITY_LEGENDARY;
    default:
      return Rarity.RARITY_UNSPECIFIED;
  }
}
