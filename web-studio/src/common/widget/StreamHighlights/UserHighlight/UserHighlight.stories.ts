import { StoryHelpers } from '@noice-com/common-ui';

import { StreamHighlightEventType } from '../types';

import { UserHighlight } from './UserHighlight';

import { BadgeBadgeType } from '@gen';

export default {
  title: 'StreamHighlights/UserHighlight',
  component: UserHighlight,
};

export const NewFollower = {
  args: {
    user: StoryHelpers.getNewProfile(),
    event: { type: StreamHighlightEventType.NewFollower },
  },
};

export const NewFollowerMysterious = {
  args: {
    user: null,
    event: { type: StreamHighlightEventType.NewFollower },
  },
};

export const NewSubscriber = {
  args: {
    user: StoryHelpers.getNewProfile(),
    event: {
      type: StreamHighlightEventType.NewSubscriber,
      badge: {
        __typename: 'BadgeBadge',
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 0,
      },
    },
  },
};

export const NewSubscriberMysterious = {
  args: {
    user: null,
    event: {
      type: StreamHighlightEventType.NewSubscriber,
      badge: {
        __typename: 'BadgeBadge',
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 0,
      },
    },
  },
};

export const NewGiftSubscription = {
  args: {
    user: StoryHelpers.getNewProfile(),
    event: {
      type: StreamHighlightEventType.NewGiftSubscription,
      badge: {
        __typename: 'BadgeBadge',
        type: BadgeBadgeType.TypeSubsGifter,
        level: 0,
      },
      recipient: {
        user: StoryHelpers.getNewProfile(),
        badge: {
          __typename: 'BadgeBadge',
          type: BadgeBadgeType.TypeChannelSubscriber,
          level: 0,
        },
      },
    },
  },
};

export const NewGiftSubscriptionMysterious = {
  args: {
    user: null,
    event: {
      type: StreamHighlightEventType.NewGiftSubscription,
      badge: {
        __typename: 'BadgeBadge',
        type: BadgeBadgeType.TypeSubsGifter,
        level: 0,
      },
      recipient: {
        user: StoryHelpers.getNewProfile(),
        badge: {
          __typename: 'BadgeBadge',
          type: BadgeBadgeType.TypeChannelSubscriber,
          level: 0,
        },
      },
    },
  },
};
