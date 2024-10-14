import { Nullable } from '@noice-com/utils';

import {
  ChannelEventAvatarItemPurchaseItemFragment,
  ChannelEventContentProfileFragment,
  ChannelEventSubscriptionContentProfileFragment,
} from '../../../gen';

export type ChannelEventModel = {
  chatItemType: 'ChannelEvent';
  channelId: string;
  id: string;
} & (
  | ChannelEventSubscriptionContent
  | ChannelEventBundleContent
  | ChannelEventCreatorCardPurchase
  | ChannelEventGiftSubscriptionContent
  | ChannelEventGiftSubscriptionContentV2
  | ChannelEventAvatarItemPurchase
);

type ChannelEventAvatarItemPurchase = {
  type: 'avatar-item-purchase';
  user: Nullable<ChannelEventContentProfileFragment>;
  item: ChannelEventAvatarItemPurchaseItemFragment;
};

type ChannelEventSubscriptionContent = {
  type: 'subscription';
  user: Nullable<
    ChannelEventContentProfileFragment & ChannelEventSubscriptionContentProfileFragment
  >;
};

type ChannelEventBundleContent = {
  bundleName: string;
  creatorCardNames?: string[];
  type: 'bundle';
  user: Nullable<ChannelEventContentProfileFragment>;
};

type ChannelEventCreatorCardPurchase = {
  creatorCardName: string;
  type: 'creator-card';
  user: Nullable<ChannelEventContentProfileFragment>;
};

/**
 * @deprecated use "ChannelEventGiftSubscriptionContentV2"
 * */
type ChannelEventGiftSubscriptionContent = {
  type: 'gift-subscription';
  user: Nullable<
    ChannelEventContentProfileFragment & ChannelEventSubscriptionContentProfileFragment
  >;
  recipient: Nullable<
    ChannelEventContentProfileFragment & ChannelEventSubscriptionContentProfileFragment
  >;
};

type ChannelEventGiftSubscriptionContentV2 = {
  type: 'gift-subscription-v2';
  user: Nullable<
    ChannelEventContentProfileFragment & ChannelEventSubscriptionContentProfileFragment
  >;
  recipients: Nullable<
    (ChannelEventContentProfileFragment &
      ChannelEventSubscriptionContentProfileFragment)[]
  >;
};

export type ChannelEventType = ChannelEventModel['type'];
