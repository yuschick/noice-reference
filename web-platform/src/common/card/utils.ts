import { RarityRarity } from '@gen';

export const getCardRarityRarityLabel = (
  rarity: RarityRarity = RarityRarity.RarityCommon,
): string => {
  switch (rarity) {
    case RarityRarity.RarityCommon:
      return 'Common';
    case RarityRarity.RarityUncommon:
      return 'Uncommon';
    case RarityRarity.RarityRare:
      return 'Rare';
    case RarityRarity.RarityEpic:
      return 'Epic';
    case RarityRarity.RarityLegendary:
      return 'Legendary';
    case RarityRarity.RarityUnspecified:
    default:
      return 'Unknown';
  }
};
