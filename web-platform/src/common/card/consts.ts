import { RarityRarity } from '@gen';

export const cardRarityOrder = {
  [RarityRarity.RarityCommon]: 1,
  [RarityRarity.RarityEpic]: 3,
  [RarityRarity.RarityLegendary]: 4,
  [RarityRarity.RarityRare]: 2,
  [RarityRarity.RarityUncommon]: 0,
  [RarityRarity.RarityUnspecified]: -1,
};
