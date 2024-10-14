import { ItemType } from '@noice-com/schemas/store/storev2.pb';

import { StoreV2ItemType } from '@gen';

export const storeV2ItemTypeToAnalyticsItemTypeMap: Record<StoreV2ItemType, ItemType> = {
  [StoreV2ItemType.ItemTypeStreamerCard]: ItemType.ITEM_TYPE_STREAMER_CARD,
  [StoreV2ItemType.ItemTypePremiumCardBundle]: ItemType.ITEM_TYPE_PREMIUM_CARD_BUNDLE,
  [StoreV2ItemType.ItemTypeStandardCardBundle]: ItemType.ITEM_TYPE_STANDARD_CARD_BUNDLE,
  [StoreV2ItemType.ItemTypeCurrencyPack]: ItemType.ITEM_TYPE_CURRENCY_PACK,
  [StoreV2ItemType.ItemTypeGiftSubscription]: ItemType.ITEM_TYPE_GIFT_SUBSCRIPTION,
  [StoreV2ItemType.ItemTypeAvatarPart]: ItemType.ITEM_TYPE_AVATAR_PART,
  [StoreV2ItemType.ItemTypeUnspecified]: ItemType.ITEM_TYPE_UNSPECIFIED,
};
