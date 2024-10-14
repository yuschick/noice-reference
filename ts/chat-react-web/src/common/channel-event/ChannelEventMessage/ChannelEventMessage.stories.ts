import { StoryHelpers } from '@noice-com/common-ui';

import { ChannelEventMessage } from './ChannelEventMessage';

import { BadgeBadgeType } from '@chat-gen';

export default {
  title: 'ChannelEventMessage',
  component: ChannelEventMessage,
};

const CHANNEL_ID = 'test-channel-id';

export const Subscription = {
  args: {
    message: {
      channelId: CHANNEL_ID,
      id: 'test-message-id',
      type: 'subscription',
      user: {
        ...StoryHelpers.getNewProfile(),
        badges: [
          {
            type: BadgeBadgeType.TypeChannelSubscriber,
            level: 0,
          },
        ],
      },
    },
  },
};

export const Bundle = {
  args: {
    message: {
      channelId: CHANNEL_ID,
      bundleName: 'test-bundle-name',
      id: 'test-message-id',
      type: 'bundle',
      user: StoryHelpers.getNewProfile(),
    },
  },
};

export const CreatorCard = {
  args: {
    message: {
      channelId: CHANNEL_ID,
      creatorCardName: 'Boom Headshot!',
      id: 'test-message-id',
      type: 'creator-card',
      user: StoryHelpers.getNewProfile(),
    },
  },
};

export const GiftSubscription = {
  args: {
    message: {
      channelId: CHANNEL_ID,
      id: 'test-message-id',
      type: 'gift-subscription',
      user: StoryHelpers.getNewProfile(),
      recipient: StoryHelpers.getNewProfile(),
    },
  },
};
