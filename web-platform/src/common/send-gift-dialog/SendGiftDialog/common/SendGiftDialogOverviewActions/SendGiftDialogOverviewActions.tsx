import { gql } from '@apollo/client';
import { Checkbox, CurrencyButton } from '@noice-com/common-ui';
import { useState } from 'react';

import { SendGiftToCommunityOverviewState } from '../../SendGiftToCommunityDialog/types';
import { SendGiftToUserOverviewState } from '../../SendGiftToUserDialog/types';

gql`
  fragment SendGiftDialogOverviewActionsSellableItem on StoreV2SellableItem {
    content {
      value {
        ... on StoreV2SubscriptionRef {
          amount
        }
      }
    }
    price {
      currency
      amount
    }
  }
`;

interface Props {
  data: SendGiftToUserOverviewState['data'] | SendGiftToCommunityOverviewState['data'];
  onPurchaseClick(giftAnonymously: boolean): void;
}

export function SendGiftDialogOverviewActions({ data, onPurchaseClick }: Props) {
  const [giftAnonymously, setGiftAnonymously] = useState(false);

  const { selectedSellableItem } = data;
  const { price, content } = selectedSellableItem;

  if (!price) {
    return null;
  }

  const getButtonLabel = () => {
    const item = content[0].value;
    if (item?.__typename === 'StoreV2SubscriptionRef') {
      return `Gift ${
        item.amount > 1 ? `${item.amount} Subscriptions` : 'a Subscription'
      }`;
    }

    return 'Give a Gift';
  };

  return (
    <>
      <Checkbox
        label="Gift anonymously"
        name="anonymous-gift"
        onChange={(event) => setGiftAnonymously(event.target.checked)}
      />

      <CurrencyButton
        currency={{
          type: 'hard',
          currency: price.currency,
          value: price.amount,
        }}
        onClick={() => onPurchaseClick(giftAnonymously)}
      >
        {getButtonLabel()}
      </CurrencyButton>
    </>
  );
}
