import { StoryHelpers } from '@noice-com/common-ui';

import { ChargebeeSubscriptionModal } from './ChargebeeSubscriptionModal';

import {
  ChannelLiveStatus,
  ChargebeeSubscriptionModelChannelDocument,
  ChargebeeSubscriptionModelChannelQuery,
  ItemItemType,
  PaymentCurrency,
  SubscriptionChannelSubscriptionCancelReason,
  SubscriptionChannelSubscriptionState,
  SubscriptionSubscriptionPricePeriod,
} from '@gen';

const CHANNEL_ID = 'channel-id';

const mockSubscriptionChannel: ChargebeeSubscriptionModelChannelQuery['channel'] = {
  __typename: 'ChannelChannel',
  id: CHANNEL_ID,
  subscription: null,
  liveStatus: ChannelLiveStatus.LiveStatusLive,
  name: 'channel_name',
  logo: 'https://client-assets-cdn.gcp.dev.noice.com/avatars/03-new.png',
  followerCount: 24,
  subscriptionConfig: {
    __typename: 'SubscriptionChannelSubscriptionConfig',
    channelId: 'channel-id',
    tiers: [
      {
        __typename: 'SubscriptionChannelSubscriptionTier',
        level: 1,
        prices: [
          {
            __typename: 'SubscriptionSubscriptionPrice',
            period: SubscriptionSubscriptionPricePeriod.PeriodMonth,
            price: 399,
            currency: PaymentCurrency.CurrencyEur,
          },
        ],
        entitlements: [
          {
            __typename: 'SubscriptionChannelSubscriptionEntitlement',
            itemId: 'd2623816-d6b0-51a0-a502-d543a8d5d886',
            item: {
              __typename: 'ItemItem',
              id: 'd2623816-d6b0-51a0-a502-d543a8d5d886',
              type: ItemItemType.TypeSubscription,
              children: [
                {
                  id: '0471a8e6-5d59-4869-a9e8-8819610c848a',
                  type: ItemItemType.TypeEmoji,
                  details: {
                    id: '0471a8e6-5d59-4869-a9e8-8819610c848a',
                    image:
                      'https://media-cdn.gcp.stg.noice.com/metagame/channel_emoji/0471a8e6-5d59-4869-a9e8-8819610c848a/23ca1699-fa12-4c30-92e9-d9635b296a9e.png',
                    name: 'fox',
                    __typename: 'EmojiEmoji',
                  },
                },
                {
                  id: '0759f915-289a-42c2-9f46-8b93e61aaf39',
                  type: ItemItemType.TypeEmoji,
                  details: {
                    id: '0759f915-289a-42c2-9f46-8b93e61aaf39',
                    image:
                      'https://media-cdn.gcp.stg.noice.com/metagame/channel_emoji/0759f915-289a-42c2-9f46-8b93e61aaf39/b8c7a46b-9c3e-45dd-a8e5-ba59824a1c08.png',
                    name: 'jacko',
                    __typename: 'EmojiEmoji',
                  },
                },
                {
                  id: '0c8fbe89-c869-47f4-b2d0-56ebd68b3e1b',
                  type: ItemItemType.TypeEmoji,
                  details: {
                    id: '0c8fbe89-c869-47f4-b2d0-56ebd68b3e1b',
                    image:
                      'https://media-cdn.gcp.stg.noice.com/metagame/channel_emoji/0c8fbe89-c869-47f4-b2d0-56ebd68b3e1b/80e11a97-5748-443a-9645-f488a3fa5b9c.png',
                    name: 'trophy',
                    __typename: 'EmojiEmoji',
                  },
                },
                {
                  id: '0f0e525e-6928-4b4b-8c1c-2c1674528a8a',
                  type: ItemItemType.TypeEmoji,
                  details: {
                    id: '0f0e525e-6928-4b4b-8c1c-2c1674528a8a',
                    image:
                      'https://media-cdn.gcp.stg.noice.com/metagame/channel_emoji/0f0e525e-6928-4b4b-8c1c-2c1674528a8a/5f7a2127-080a-4cb5-806a-33850ff12ab7.png',
                    name: 'moonwatching',
                    __typename: 'EmojiEmoji',
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
};

const mockCancelledSubscriptionChannel: ChargebeeSubscriptionModelChannelQuery['channel'] =
  {
    ...mockSubscriptionChannel,
    subscription: {
      id: 'subscription-id',
      state: SubscriptionChannelSubscriptionState.StateCancelled,
      cancelReason: SubscriptionChannelSubscriptionCancelReason.CancelReasonUnspecified,
    },
  };

const mockExpiredSubscriptionChannel: ChargebeeSubscriptionModelChannelQuery['channel'] =
  {
    ...mockSubscriptionChannel,
    subscription: {
      id: 'subscription-id',
      state: SubscriptionChannelSubscriptionState.StateExpired,
      cancelReason: SubscriptionChannelSubscriptionCancelReason.CancelReasonUnspecified,
    },
  };

export default {
  title: 'SubscriptionModal',
  component: ChargebeeSubscriptionModal,
};

export const Default = {
  args: {
    channelId: CHANNEL_ID,
  },
  parameters: StoryHelpers.Apollo.addMocks([
    StoryHelpers.Apollo.createMock(
      ChargebeeSubscriptionModelChannelDocument,
      {
        channelId: CHANNEL_ID,
      },
      {
        channel: mockSubscriptionChannel,
      },
    ),
  ]),
};

export const Cancelled = {
  args: {
    channelId: CHANNEL_ID,
  },
  parameters: StoryHelpers.Apollo.addMocks([
    StoryHelpers.Apollo.createMock(
      ChargebeeSubscriptionModelChannelDocument,
      {
        channelId: CHANNEL_ID,
      },
      {
        channel: mockCancelledSubscriptionChannel,
      },
    ),
  ]),
};

export const Expired = {
  args: {
    channelId: CHANNEL_ID,
  },
  parameters: StoryHelpers.Apollo.addMocks([
    StoryHelpers.Apollo.createMock(
      ChargebeeSubscriptionModelChannelDocument,
      {
        channelId: CHANNEL_ID,
      },
      {
        channel: mockExpiredSubscriptionChannel,
      },
    ),
  ]),
};
