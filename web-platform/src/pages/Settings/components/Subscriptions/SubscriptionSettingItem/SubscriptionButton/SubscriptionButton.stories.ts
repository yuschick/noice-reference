import { SubscriptionButton } from './SubscriptionButton';

import {
  SubscriptionButtonSubscriptionFragment,
  SubscriptionChannelSubscriptionState,
} from '@gen';

const mockSubscription: SubscriptionButtonSubscriptionFragment = {
  id: 'subscription-id',
  state: SubscriptionChannelSubscriptionState.StateActive,
  channel: {
    id: 'channel-id',
    monetizationSettings: {
      enabled: true,
    },
  },
};

export default {
  title: 'Settings/SubscriptionButton',
  component: SubscriptionButton,
};

export const Default = {
  args: {
    subscription: mockSubscription,
  },
};

export const Cancelled = {
  args: {
    subscription: {
      ...mockSubscription,
      state: SubscriptionChannelSubscriptionState.StateCancelled,
    },
  },
};

export const Expired = {
  args: {
    subscription: {
      ...mockSubscription,
      state: SubscriptionChannelSubscriptionState.StateExpired,
    },
  },
};
