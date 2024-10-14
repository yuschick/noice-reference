import { gql } from '@apollo/client';

import { GiftSubscriptionGetChannelIdSellableItemFragment } from '@gen';

gql`
  fragment GiftSubscriptionGetChannelIdSellableItem on StoreV2SellableItem {
    content {
      value {
        __typename
        ... on StoreV2SubscriptionRef {
          channelId
        }
      }
    }
  }
`;

export const getChannelIdFromSellableItem = (
  sellableItem: GiftSubscriptionGetChannelIdSellableItemFragment,
) => {
  if (sellableItem.content[0].value?.__typename === 'StoreV2SubscriptionRef') {
    return sellableItem.content[0].value.channelId;
  }

  return null;
};
