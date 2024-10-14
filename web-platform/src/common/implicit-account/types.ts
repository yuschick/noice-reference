import { AnalyticsEventClientUpSellingDialogUpSellingDialogSource } from '@noice-com/schemas/analytics/analytics.pb';

export enum UpSellingDialogCategory {
  GameAndCards = 'GameAndCards',
  Creator = 'Creator',
  Avatar = 'Avatar',
}

export enum UpSellingDialogSource {
  CardBundle = 'CardBundle',
  InGameCurrencyBundle = 'InGameCurrencyBundle',
  PaymentCurrencyBundle = 'PaymentCurrencyBundle',
  FollowChannel = 'FollowChannel',
  SubscribeChannel = 'SubscribeChannel',
  CustomizeAvatar = 'CustomizeAvatar',
  CreatorCardBundle = 'CreatorCardBundle',
  CreatorCard = 'CreatorCard',
  ChatMessage = 'ChatMessage',
}

export const sourceMap: Record<
  UpSellingDialogSource,
  AnalyticsEventClientUpSellingDialogUpSellingDialogSource
> = {
  [UpSellingDialogSource.CardBundle]:
    AnalyticsEventClientUpSellingDialogUpSellingDialogSource.UP_SELLING_DIALOG_SOURCE_CARD_BUNDLE,
  [UpSellingDialogSource.InGameCurrencyBundle]:
    AnalyticsEventClientUpSellingDialogUpSellingDialogSource.UP_SELLING_DIALOG_SOURCE_IN_GAME_CURRENCY_BUNDLE,
  [UpSellingDialogSource.PaymentCurrencyBundle]:
    AnalyticsEventClientUpSellingDialogUpSellingDialogSource.UP_SELLING_DIALOG_SOURCE_PAYMENT_CURRENCY_BUNDLE,
  [UpSellingDialogSource.FollowChannel]:
    AnalyticsEventClientUpSellingDialogUpSellingDialogSource.UP_SELLING_DIALOG_SOURCE_FOLLOW_CHANNEL,
  [UpSellingDialogSource.SubscribeChannel]:
    AnalyticsEventClientUpSellingDialogUpSellingDialogSource.UP_SELLING_DIALOG_SOURCE_SUBSCRIBE_CHANNEL,
  [UpSellingDialogSource.CustomizeAvatar]:
    AnalyticsEventClientUpSellingDialogUpSellingDialogSource.UP_SELLING_DIALOG_SOURCE_CUSTOMIZE_AVATAR,
  [UpSellingDialogSource.CreatorCardBundle]:
    AnalyticsEventClientUpSellingDialogUpSellingDialogSource.UP_SELLING_DIALOG_SOURCE_CREATOR_CARD_BUNDLE,
  [UpSellingDialogSource.CreatorCard]:
    AnalyticsEventClientUpSellingDialogUpSellingDialogSource.UP_SELLING_DIALOG_SOURCE_CREATOR_CARD,
  [UpSellingDialogSource.ChatMessage]:
    AnalyticsEventClientUpSellingDialogUpSellingDialogSource.UP_SELLING_DIALOG_SOURCE_SEND_CHAT_MESSAGE,
};

export const sourceToCategoryMap: Record<UpSellingDialogSource, UpSellingDialogCategory> =
  {
    [UpSellingDialogSource.CardBundle]: UpSellingDialogCategory.GameAndCards,
    [UpSellingDialogSource.InGameCurrencyBundle]: UpSellingDialogCategory.GameAndCards,
    [UpSellingDialogSource.PaymentCurrencyBundle]: UpSellingDialogCategory.GameAndCards,
    [UpSellingDialogSource.FollowChannel]: UpSellingDialogCategory.Creator,
    [UpSellingDialogSource.SubscribeChannel]: UpSellingDialogCategory.Creator,
    [UpSellingDialogSource.CustomizeAvatar]: UpSellingDialogCategory.Avatar,
    [UpSellingDialogSource.CreatorCardBundle]: UpSellingDialogCategory.Creator,
    [UpSellingDialogSource.CreatorCard]: UpSellingDialogCategory.Creator,
    [UpSellingDialogSource.ChatMessage]: UpSellingDialogCategory.Creator,
  };
