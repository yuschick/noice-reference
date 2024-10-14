import { ChannelStoreFrontCategoriesCategoryFragment } from '@gen';

export type PurchaseStage = 'confirm' | 'complete' | 'not-enough-credits';
export type CosmeticsPurchaseItem =
  ChannelStoreFrontCategoriesCategoryFragment['sellableItems'][0];
