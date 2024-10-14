import { SubscriptionButton } from './SubscriptionButton';

import {
  SubscriptionButtonChannelFragment,
  SubscriptionChannelSubscriptionState,
} from '@gen';

const mockChannel: SubscriptionButtonChannelFragment = {
  id: 'channel-id',
  following: true,
  subscriptionConfig: {
    channelId: 'channel-id',
    subscriptionsEnabled: true,
  },
  monetizationSettings: {
    enabled: true,
  },
};

export default {
  title: 'Channel/SubscriptionButton',
  component: SubscriptionButton,
};

export const Default = {
  args: {
    channel: mockChannel,
  },
};

export const NotFollowing = {
  args: {
    channel: {
      ...mockChannel,
      following: false,
    },
  },
};

export const Active = {
  args: {
    channel: {
      ...mockChannel,
      subscription: {
        id: 'subscription-id',
        state: SubscriptionChannelSubscriptionState.StateActive,
      },
    },
  },
};

export const Cancelled = {
  args: {
    channel: {
      ...mockChannel,
      subscription: {
        id: 'subscription-id',
        state: SubscriptionChannelSubscriptionState.StateCancelled,
      },
    },
  },
};

export const Expired = {
  args: {
    channel: {
      ...mockChannel,
      subscription: {
        id: 'subscription-id',
        state: SubscriptionChannelSubscriptionState.StateExpired,
      },
    },
  },
};
