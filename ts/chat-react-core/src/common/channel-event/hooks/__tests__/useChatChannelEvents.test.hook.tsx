import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { MockSubscriptionLink } from '@apollo/client/testing';
import { DeepPartial } from '@noice-com/utils';
import { renderHook, waitFor } from '@testing-library/react';

import {
  ChannelBundlePurchase,
  ChannelChannelEventContentContentUnion,
  ChannelGiftSubscriptionPurchase,
  ChannelStreamerCardPurchase,
  ChannelSubscriptionPurchase,
  ProfileColor,
} from '../../../../../gen';
import { useChatChannelEvents } from '../useChatChannelEvents.hook';

const CHANNEL_ID = 'channel-id';
const link = new MockSubscriptionLink();
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const USER_ID = 'user-id';
const mockUser = {
  userId: USER_ID,
  userTag: 'username',
};

let eventId = 0;

const mockChannelEventResult = <
  T extends DeepPartial<ChannelChannelEventContentContentUnion> = DeepPartial<ChannelChannelEventContentContentUnion>,
>(
  content: DeepPartial<T>,
) => ({
  result: {
    data: {
      channelEventsSubscribe: {
        channelId: CHANNEL_ID,
        createdAt: '2021-01-01T00:00:00Z',
        id: `event-id-${eventId++}`,
        content: {
          content: {
            ...content,
            preferredColor: ProfileColor.ColorUnspecified,
            userId: USER_ID,
            user: mockUser,
          },
        },
      },
    },
  },
});

const mockAddMessage = jest.fn();
const mockRemoveMessages = jest.fn();

describe('useChatChannelEvents hook', () => {
  beforeEach(() => {
    renderHook(
      () =>
        useChatChannelEvents({
          channelId: CHANNEL_ID,
          addMessage: mockAddMessage,
          removeMessages: mockRemoveMessages,
        }),
      {
        wrapper: ({ children }) => (
          <ApolloProvider client={client}>{children}</ApolloProvider>
        ),
      },
    );
  });

  it('does not add messages when no events', () => {
    expect(mockAddMessage).not.toHaveBeenCalled();
  });

  it('does not add messages when no events event has no content', () => {
    link.simulateResult(mockChannelEventResult({}));

    expect(mockAddMessage).not.toHaveBeenCalled();
  });

  it('adds subscription purchase to the events', async () => {
    link.simulateResult(
      mockChannelEventResult<ChannelSubscriptionPurchase>({
        __typename: 'ChannelSubscriptionPurchase',
        userId: USER_ID,
        tier: 1,
      }),
    );

    await waitFor(() => {
      expect(mockAddMessage).toHaveBeenCalledWith({
        chatItemType: 'ChannelEvent',
        id: expect.any(String),
        channelId: CHANNEL_ID,
        type: 'subscription',
        user: mockUser,
      });
    });
  });

  it('adds channel bundle purchase to the events', async () => {
    link.simulateResult(
      mockChannelEventResult<ChannelBundlePurchase>({
        __typename: 'ChannelBundlePurchase',
        bundleName: 'bundle-name',
        streamerCards: [
          {
            id: 'streamer-card-id',
            channelId: CHANNEL_ID,
            baseCard: {
              id: 'base-card-id',
              name: 'card-name',
            },
          },
        ],
      }),
    );

    await waitFor(() => {
      expect(mockAddMessage).toHaveBeenCalledWith({
        chatItemType: 'ChannelEvent',
        id: expect.any(String),
        channelId: CHANNEL_ID,
        type: 'bundle',
        user: mockUser,
        bundleName: 'bundle-name',
        creatorCardNames: ['card-name'],
      });
    });
  });

  it('adds streamer card purchase to the events', async () => {
    link.simulateResult(
      mockChannelEventResult<ChannelStreamerCardPurchase>({
        __typename: 'ChannelStreamerCardPurchase',
        streamerCard: {
          id: 'streamer-card-id',
          channelId: CHANNEL_ID,
          baseCard: {
            id: 'base-card-id',
            name: 'card-name',
          },
        },
      }),
    );

    await waitFor(() => {
      expect(mockAddMessage).toHaveBeenCalledWith({
        chatItemType: 'ChannelEvent',
        id: expect.any(String),
        channelId: CHANNEL_ID,
        type: 'creator-card',
        user: mockUser,
        creatorCardName: 'card-name',
      });
    });
  });

  it('adds gift subscription to the events', async () => {
    const recipient = {
      userId: 'recipient-id',
      userTag: 'recipient-username',
    };

    link.simulateResult(
      mockChannelEventResult<ChannelGiftSubscriptionPurchase>({
        __typename: 'ChannelGiftSubscriptionPurchase',
        recipients: [recipient],
      }),
    );

    await waitFor(() => {
      expect(mockAddMessage).toHaveBeenCalledWith({
        chatItemType: 'ChannelEvent',
        id: expect.any(String),
        channelId: CHANNEL_ID,
        type: 'gift-subscription',
        user: mockUser,
        recipient,
      });
    });
  });
});
