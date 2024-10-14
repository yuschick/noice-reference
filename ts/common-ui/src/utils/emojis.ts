import { gql } from '@apollo/client';

import {
  ItemItemType,
  SubscriptionGetChannelEmojisChannelEmojiFragment,
  SubscriptionGetChannelEmojisChannelFragment,
} from '@common-gen';

gql`
  fragment SubscriptionGetChannelEmojisChannel on ChannelChannel {
    subscriptionConfig {
      channelId
      tiers {
        level
        entitlements {
          itemId
          item {
            id
            type
            children {
              id
              type
              details {
                ... on EmojiEmoji {
                  ...SubscriptionGetChannelEmojisChannelEmoji
                }
              }
            }
          }
        }
      }
    }
  }

  fragment SubscriptionGetChannelEmojisChannelEmoji on EmojiEmoji {
    __typename
    id
    image
    name
  }
`;

export const getChannelEmojis = (
  channel: SubscriptionGetChannelEmojisChannelFragment,
): SubscriptionGetChannelEmojisChannelEmojiFragment[] => {
  const firstTier = channel.subscriptionConfig?.tiers.find((tier) => tier.level === 1);

  if (!firstTier) {
    return [];
  }

  const subscriptionItem = firstTier.entitlements.find(
    (e) => e.item.type === ItemItemType.TypeSubscription,
  )?.item;

  if (!subscriptionItem) {
    return [];
  }

  return (
    subscriptionItem.children
      ?.filter(
        (c) =>
          c.type === ItemItemType.TypeEmoji && c.details?.__typename === 'EmojiEmoji',
      )
      .map((c) => c.details as SubscriptionGetChannelEmojisChannelEmojiFragment) ?? []
  );
};
