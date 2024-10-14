import { gql } from '@apollo/client';
import {
  useRestartingSubscription,
  variablesOrSkip,
} from '@noice-com/apollo-client-utils';
import { Nullable } from '@noice-com/utils';
import { useEffect, useMemo } from 'react';

import {
  ChatChannelEventsSubscriptionDocument,
  ChatChannelEventsSubscriptionSubscription,
  ChatChannelEventsSubscriptionSubscriptionVariables,
} from '../../../../gen';
import { useChatMessages } from '../../chat-messages';
import { ChannelEventType } from '../types';

const EventTypeLookup: Record<ChannelEventType, string> = {
  'avatar-item-purchase': 'ChannelAvatarItemPurchase',
  subscription: 'ChannelSubscriptionPurchase',
  bundle: 'ChannelBundlePurchase',
  'gift-subscription': 'ChannelGiftSubscriptionPurchase',
  'gift-subscription-v2': 'ChannelGiftSubscriptionPurchase',
  'creator-card': 'ChannelStreamerCardPurchase',
};

const createLookupCache = (events: ChannelEventType[]) => {
  return events.map((event) => EventTypeLookup[event]);
};

gql`
  subscription ChatChannelEventsSubscription($channelId: ID!) {
    channelEventsSubscribe(channelId: $channelId) {
      channelId
      createdAt
      id

      content {
        content {
          ... on ChannelAvatarItemPurchase {
            itemId
            item {
              ...ChannelEventAvatarItemPurchaseItem
            }
            user {
              userId
              ...ChannelEventContentProfile
            }
          }

          ... on ChannelSubscriptionPurchase {
            userId
            tier
            user {
              userId
              ...ChannelEventContentProfile
              ...ChannelEventSubscriptionContentProfile
            }
          }

          ... on ChannelBundlePurchase {
            bundleName
            userId
            streamerCards {
              id
              channelId
              baseCard {
                id
                name
              }
            }
            user {
              userId
              ...ChannelEventContentProfile
            }
          }

          ... on ChannelStreamerCardPurchase {
            streamerCard {
              id
              channelId
              baseCard {
                id
                name
              }
            }
            userId
            user {
              userId
              ...ChannelEventContentProfile
            }
          }

          ... on ChannelGiftSubscriptionPurchase {
            userId
            user {
              userId
              ...ChannelEventContentProfile
              ...ChannelEventSubscriptionContentProfile
            }
            recipients {
              userId
              ...ChannelEventContentProfile
              ...ChannelEventSubscriptionContentProfile
            }
          }
        }
      }
    }
  }

  fragment ChannelEventContentProfile on ProfileProfile {
    preferredColor
    userId
    userTag
  }

  fragment ChannelEventSubscriptionContentProfile on ProfileProfile {
    badges(channel_id: $channelId) {
      type
      level
    }
  }

  fragment ChannelEventAvatarItemPurchaseItem on ItemItem {
    id
    name
  }
`;

interface Props {
  channelId: Nullable<string>;
  ignoreTypes?: ChannelEventType[];
  addMessage: ReturnType<typeof useChatMessages>['addMessage'];
  removeMessages: ReturnType<typeof useChatMessages>['removeMessages'];
}

export function useChatChannelEvents({
  channelId,
  ignoreTypes = [],
  addMessage,
  removeMessages,
}: Props) {
  const ignoreCache = useMemo(() => {
    return createLookupCache(ignoreTypes);
  }, [ignoreTypes]);

  useRestartingSubscription<
    ChatChannelEventsSubscriptionSubscription,
    ChatChannelEventsSubscriptionSubscriptionVariables
  >(ChatChannelEventsSubscriptionDocument, {
    ...variablesOrSkip({ channelId }),
    onData({ data }) {
      const content = data.data?.channelEventsSubscribe;
      const event = data.data?.channelEventsSubscribe?.content.content;

      if (!event?.__typename || !content || ignoreCache.includes(event?.__typename)) {
        return;
      }

      if (event.__typename === 'ChannelAvatarItemPurchase') {
        addMessage({
          channelId: content.channelId,
          chatItemType: 'ChannelEvent',
          id: content.id,
          item: event.item,
          type: 'avatar-item-purchase',
          user: event.user ?? null,
        });
        return;
      }

      if (event.__typename === 'ChannelSubscriptionPurchase') {
        addMessage({
          chatItemType: 'ChannelEvent',
          type: 'subscription',
          id: content.id,
          user: event.user ?? null,
          channelId: content.channelId,
        });
        return;
      }

      if (event.__typename === 'ChannelBundlePurchase') {
        addMessage({
          chatItemType: 'ChannelEvent',
          type: 'bundle',
          id: content.id,
          channelId: content.channelId,
          creatorCardNames: event.streamerCards?.map((card) => card.baseCard.name),
          user: event.user ?? null,
          bundleName: event.bundleName,
        });
        return;
      }

      if (event.__typename === 'ChannelStreamerCardPurchase') {
        addMessage({
          chatItemType: 'ChannelEvent',
          type: 'creator-card',
          id: content.id,
          channelId: content.channelId,
          creatorCardName: event.streamerCard?.baseCard.name,
          user: event.user ?? null,
        });
        return;
      }

      if (event.__typename === 'ChannelGiftSubscriptionPurchase') {
        addMessage({
          chatItemType: 'ChannelEvent',
          type: 'gift-subscription-v2',
          id: content.id,
          channelId: content.channelId,
          recipients: event.recipients ?? null,
          user: event.user ?? null,
        });

        // TODO: remove this after all clients start using 'gift-subscription-v2'
        event.recipients?.forEach((recipient) => {
          addMessage({
            chatItemType: 'ChannelEvent',
            type: 'gift-subscription',
            id: content.id,
            channelId: content.channelId,
            recipient: recipient ?? null,
            user: event.user ?? null,
          });
        });
      }

      return;
    },
  });

  useEffect(() => {
    removeMessages('ChannelEvent');
  }, [channelId, removeMessages]);
}
