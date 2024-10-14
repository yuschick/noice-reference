import { SubscriptionSettingItem } from './SubscriptionSettingItem';

import {
  ChannelLiveStatus,
  SubscriptionChannelSubscriptionProvider,
  SubscriptionChannelSubscriptionState,
  SubscriptionSettingItemSubscriptionFragment,
} from '@gen';

const subscription: SubscriptionSettingItemSubscriptionFragment = {
  id: 'subscription-id',
  state: SubscriptionChannelSubscriptionState.StateActive,
  activatedAt: '2023-09-19T11:48:28Z',
  expiresAt: '2023-10-19T11:48:28Z',
  provider: SubscriptionChannelSubscriptionProvider.ProviderChargebee,
  channel: {
    liveStatus: ChannelLiveStatus.LiveStatusLive,
    id: 'channel-id',
    name: 'channel_name',
    logo: 'https://via.placeholder.com/150',
    offlineBanner: 'https://via.placeholder.com/500',
    monetizationSettings: {
      enabled: true,
    },
  },
};

export default {
  title: 'SubscriptionSettingItem',
  component: SubscriptionSettingItem,
};

export const Default = {
  args: {
    subscription,
  },
};

export const Cancelled = {
  args: {
    subscription: {
      ...subscription,
      state: SubscriptionChannelSubscriptionState.StateCancelled,
    },
  },
};

export const Expired = {
  args: {
    subscription: {
      ...subscription,
      cancelledAt: '2023-10-19T11:48:28Z',
      state: SubscriptionChannelSubscriptionState.StateExpired,
    },
  },
};

export const ActiveWithPaymentFail = {
  args: {
    subscription: {
      ...subscription,
      paymentFailedAt: '2023-10-19T11:48:28Z',
    },
  },
};

export const ExpiredWithPaymentFail = {
  args: {
    subscription: {
      ...Expired.args.subscription,
      paymentFailedAt: '2023-10-19T11:48:28Z',
    },
  },
};
