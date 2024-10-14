import { Nullable } from '@noice-com/utils';

import {
  ChannelEventContentProfileFragment,
  ChannelEventSubscriptionContentProfileFragment,
} from '@gen/graphql';

export type ChannelEventModel = {
  channelId: string;
  content:
    | ChannelEventSubscriptionContent
    | ChannelEventBundleContent
    | ChannelEventCreatorCardPurchase
    | ChannelEventGiftSubscriptionContent;
  id: string;
  time: Date;
  type: 'channel-event';
};

type ChannelEventSubscriptionContent = {
  id: string;
  type: 'subscription';
  user: Nullable<
    ChannelEventContentProfileFragment & ChannelEventSubscriptionContentProfileFragment
  >;
};

type ChannelEventBundleContent = {
  bundleName: string;
  creatorCardNames?: string[];
  id: string;
  type: 'bundle';
  user: Nullable<ChannelEventContentProfileFragment>;
};

type ChannelEventCreatorCardPurchase = {
  creatorCardName: string;
  id: string;
  type: 'creator-card';
  user: Nullable<ChannelEventContentProfileFragment>;
};

type ChannelEventGiftSubscriptionContent = {
  id: string;
  type: 'gift-subscription';
  user: Nullable<
    ChannelEventContentProfileFragment & ChannelEventSubscriptionContentProfileFragment
  >;
  recipient: Nullable<
    ChannelEventContentProfileFragment & ChannelEventSubscriptionContentProfileFragment
  >;
};
