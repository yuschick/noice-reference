import { GiftTarget } from '@noice-com/social';

import { getCommunityGiftProductName } from '../../SendGiftToCommunityDialog';
import { SendGiftToCommunityPaymentState } from '../../SendGiftToCommunityDialog/types';
import { SendGiftToUserPaymentState } from '../../SendGiftToUserDialog/types';

import styles from './SendGiftDialogPaymentContent.module.css';

import { AdyenPurchaseContent } from '@common/purchase';
import { SellableItem } from '@common/sellable-item';
import {
  SendGiftDialogSellableItemFragment,
  SendGiftToUserDialogProfileFragment,
  StoreV2ItemType,
} from '@gen';

interface GiftPurchaseSummary {
  sellableItem: SendGiftDialogSellableItemFragment;
  channelName: string | undefined;
  formattedPrice: undefined | string;
  formattedOriginalPrice: undefined | string;
  purchaseData:
    | SendGiftToUserPaymentState['data']
    | SendGiftToCommunityPaymentState['data'];
}

interface GiftToUserPurchaseSummary extends GiftPurchaseSummary {
  target: GiftTarget.User;
  profile: SendGiftToUserDialogProfileFragment;
}

interface GiftToCommunityPurchaseSummary extends GiftPurchaseSummary {
  target: GiftTarget.Community;
}

type Props = GiftToCommunityPurchaseSummary | GiftToUserPurchaseSummary;

const getProductName = (props: Props) => {
  const { type, name } = props.sellableItem;

  if (type === StoreV2ItemType.ItemTypeGiftSubscription) {
    switch (props.target) {
      case GiftTarget.User:
        return `${props.channelName ? `${props.channelName} ` : ''}subscription to ${
          props.profile.userTag
        }`;
      case GiftTarget.Community:
        if (
          props.sellableItem.content[0].value?.__typename === 'StoreV2SubscriptionRef'
        ) {
          return getCommunityGiftProductName(props.sellableItem.content[0].value.amount);
        }
    }
  }

  return name;
};

export const PurchaseSummary = (props: Props) => {
  const { orderId, session, onPaymentCompleted, onPaymentFailed } = props.purchaseData;

  return (
    <section className={styles.purchaseSummaryWrapper}>
      <h2 className={styles.purchaseSummaryTitle}>Purchase Summary</h2>

      <SellableItem
        formattedOriginalPrice={props.formattedOriginalPrice}
        formattedPrice={props.formattedPrice}
        itemName={`Gift ${getProductName(props)}`}
      />

      <hr className={styles.divider} />

      <AdyenPurchaseContent
        orderId={orderId}
        session={session}
        onPaymentCompleted={onPaymentCompleted}
        onPaymentFailed={onPaymentFailed}
      />
    </section>
  );
};
