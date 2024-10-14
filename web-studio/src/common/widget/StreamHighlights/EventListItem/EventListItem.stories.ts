import { StoryHelpers } from '@noice-com/common-ui';

import { StreamHighlightEventType } from '../types';

import { EventListItem } from './EventListItem';

import { BadgeBadgeType } from '@gen';

export default {
  title: 'StreamHighlights/EventListItem',
  component: EventListItem,
  args: {
    timestamp: new Date(),
  },
};

export const HighScoringCard = {
  args: {
    event: { type: StreamHighlightEventType.HighScroringCard, details: '3476 points' },
    user: StoryHelpers.getNewProfile(),
  },
};

export const MatchStart = {
  args: {
    event: { type: StreamHighlightEventType.MatchStart },
  },
};

export const NewFollower = {
  args: {
    event: { type: StreamHighlightEventType.NewFollower },
    user: StoryHelpers.getNewProfile(),
  },
};

export const NewViewer = {
  args: {
    event: { type: StreamHighlightEventType.NewViewer },
    user: StoryHelpers.getNewProfile(),
  },
};

export const HighScoringCreatorCard = {
  args: {
    event: {
      type: StreamHighlightEventType.HighScoringCreatorCard,
      details: '3476 points',
    },
    user: StoryHelpers.getNewProfile(),
  },
};

export const HighScoringCreatorCardMysterious = {
  args: {
    event: {
      type: StreamHighlightEventType.HighScoringCreatorCard,
      details: '3476 points',
    },
    user: null,
  },
};

export const NewSubscriber = {
  args: {
    event: {
      type: StreamHighlightEventType.NewSubscriber,
      badge: {
        __typename: 'BadgeBadge',
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 0,
      },
    },
    user: StoryHelpers.getNewProfile(),
  },
};

export const NewSubscriberMysterious = {
  args: {
    event: {
      type: StreamHighlightEventType.NewSubscriber,
      badge: {
        __typename: 'BadgeBadge',
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 0,
      },
    },
    user: null,
  },
};

export const NewGiftSubscription = {
  args: {
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
    user: StoryHelpers.getNewProfile(),
  },
};

export const NewGiftSubscriptionMysterious = {
  args: {
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
    user: null,
  },
};
