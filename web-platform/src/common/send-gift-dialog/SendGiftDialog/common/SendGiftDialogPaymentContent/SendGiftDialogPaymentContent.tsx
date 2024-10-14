import { gql } from '@apollo/client';
import { GiftTarget } from '@noice-com/social';
import { useEffect } from 'react';

import { SendGiftToUserPaymentState } from '../../SendGiftToUserDialog/types';
import { getChannelIdFromSellableItem } from '../../utils';

import { PurchaseSummary } from './PurchaseSummary';
import styles from './SendGiftDialogPaymentContent.module.css';

import { getFormattedPricesWithCurrency } from '@common/currency';
import { PurchaseStatus } from '@common/purchase';
import { SendGiftToCommunityPaymentState } from '@common/send-gift-dialog/SendGiftDialog/SendGiftToCommunityDialog/types';
import { SubscriptionDialogChannelContent } from '@common/subscription';
import { StoreV2ItemType, useSendGiftDialogPaymentContentChannelLazyQuery } from '@gen';

gql`
  fragment SendGiftToUserDialogPaymentSellableItem on StoreV2SellableItem {
    type
    name
    price {
      amount
      amountWithoutDiscount
      currency
    }
  }

  query SendGiftDialogPaymentContentChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
      ...SubscriptionDialogChannelContentChannel
    }
  }
`;

interface GiftToUserPaymentContent {
  target: GiftTarget.User;
  data: SendGiftToUserPaymentState['data'];
}

interface GiftToCommunityPaymentContent {
  target: GiftTarget.Community;
  data: SendGiftToCommunityPaymentState['data'];
}

type Props = GiftToCommunityPaymentContent | GiftToUserPaymentContent;

export function SendGiftDialogPaymentContent({ target, data }: Props) {
  const { selectedSellableItem, purchaseStatus } = data;
  const { price, type } = selectedSellableItem;

  const channelId = getChannelIdFromSellableItem(selectedSellableItem);

  const [fetchChannel, { data: channelData }] =
    useSendGiftDialogPaymentContentChannelLazyQuery();

  useEffect(() => {
    if (!channelId) {
      return;
    }

    fetchChannel({
      variables: {
        channelId,
      },
    });
  }, [channelId, fetchChannel]);

  const { formattedPrice, formattedOriginalPrice } =
    getFormattedPricesWithCurrency(price);

  if (purchaseStatus === PurchaseStatus.Payment) {
    switch (target) {
      case GiftTarget.User:
        return (
          <PurchaseSummary
            channelName={channelData?.channel?.name}
            formattedOriginalPrice={formattedOriginalPrice}
            formattedPrice={formattedPrice}
            profile={data.profile}
            purchaseData={data}
            sellableItem={selectedSellableItem}
            target={target}
          />
        );
      case GiftTarget.Community:
        return (
          <PurchaseSummary
            channelName={channelData?.channel?.name}
            formattedOriginalPrice={formattedOriginalPrice}
            formattedPrice={formattedPrice}
            purchaseData={data}
            sellableItem={selectedSellableItem}
            target={target}
          />
        );
    }
  }

  if (purchaseStatus === PurchaseStatus.Authorised) {
    if (type === StoreV2ItemType.ItemTypeGiftSubscription && channelData?.channel) {
      return (
        <section className={styles.paymentResultContent}>
          <SubscriptionDialogChannelContent channel={channelData.channel} />

          <div>
            {target === GiftTarget.User &&
              `Thank you for your support and subscribing to ${channelData.channel.name}!`}
            {target === GiftTarget.Community &&
              'Thanks you for your support! The subs are on their way, unlocking sweet new channel perks for others to enjoy!'}
          </div>
        </section>
      );
    }

    return <div>Payment successful!</div>;
  }

  return <div>Payment failed, please try again</div>;
}
