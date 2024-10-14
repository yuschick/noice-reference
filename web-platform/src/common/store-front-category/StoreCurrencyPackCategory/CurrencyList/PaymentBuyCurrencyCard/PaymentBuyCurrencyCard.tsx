import { gql } from '@apollo/client';
import { useConversionEvents } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useCallback, useState } from 'react';

import { useStoreFrontRefetch } from '../../../context';
import { AdyenOverlay } from '../AdyenOverlay/AdyenOverlay';
import { CurrencyCard } from '../CurrencyCard/CurrencyCard';

import {
  UpSellingDialogSource,
  useImplicitAccountUpSellingAction,
} from '@common/implicit-account';
import { useAdyenCancelOrderMutation } from '@common/purchase';
import {
  AdyenSession,
  PaymentBuyCurrencyCardSellableItemFragment,
  useStoreBuyCurrencyBundleWithPaymentMutation,
} from '@gen';

gql`
  mutation StoreBuyCurrencyBundleWithPayment($itemId: ID!, $signature: String!) {
    buyWithPayment(itemId: $itemId, signature: $signature) {
      orderId
      session {
        session {
          ... on AdyenSession {
            id
            reference
            returnUrl
            sessionData
            amount {
              value
              currency
            }
          }
        }
      }
    }
  }
`;

interface Props {
  sellableItem: PaymentBuyCurrencyCardSellableItemFragment;
}

export function PaymentBuyCurrencyCard({ sellableItem }: Props) {
  const { sendItemPurchasedConversionEvent } = useConversionEvents();
  const { refetchStoreFrontCategories } = useStoreFrontRefetch();

  const [showBuyOverlay, setShowBuyOverlay] = useState(false);
  const [orderId, setOrderId] = useState<Nullable<string>>(null);
  const [adyenSession, setAdyenSession] = useState<Nullable<AdyenSession>>(null);

  const closeModal = () => {
    setShowBuyOverlay(false);
    setOrderId(null);
    setAdyenSession(null);
  };

  const { onAction } = useImplicitAccountUpSellingAction(
    UpSellingDialogSource.PaymentCurrencyBundle,
  );
  const [onCardPurchaseClick, { loading }] = useStoreBuyCurrencyBundleWithPaymentMutation(
    {
      variables: {
        itemId: sellableItem.id,
        signature: sellableItem.signature,
      },
      onCompleted(data) {
        const session = data?.buyWithPayment?.session.session;
        const orderId = data?.buyWithPayment?.orderId;

        if (!session || !orderId) {
          return;
        }

        setAdyenSession(session.__typename === 'AdyenSession' ? session : null);
        setOrderId(orderId);
        setShowBuyOverlay(true);
      },
    },
  );

  const [cancelOrder] = useAdyenCancelOrderMutation({
    onCompleted() {
      // Close the modal when cancelling completed
      closeModal();
      refetchStoreFrontCategories();
    },
  });

  const onModalCloseOnCancel = useCallback(() => {
    if (!orderId) {
      return;
    }

    cancelOrder({
      variables: {
        orderId,
      },
    });

    setShowBuyOverlay(false);
    setOrderId(null);
    setAdyenSession(null);
  }, [cancelOrder, orderId]);

  const onPaymentCompleted = useCallback(() => {
    sendItemPurchasedConversionEvent({
      contentType: 'hard-currency',
      contentId: sellableItem.id,
      currency: sellableItem.price?.currency,
      value: sellableItem.price?.amount,
    });
    refetchStoreFrontCategories();
  }, [
    refetchStoreFrontCategories,
    sellableItem.id,
    sellableItem.price?.amount,
    sellableItem.price?.currency,
    sendItemPurchasedConversionEvent,
  ]);

  return (
    <>
      <CurrencyCard
        isPurchasing={loading}
        sellableItem={sellableItem}
        onPurchaseClick={() => onAction(onCardPurchaseClick)}
      />

      {showBuyOverlay && (
        <AdyenOverlay
          orderId={orderId}
          sellableItem={sellableItem}
          session={adyenSession}
          onModalCloseOnCancel={onModalCloseOnCancel}
          onModalCloseOnComplete={closeModal}
          onPaymentCompleted={onPaymentCompleted}
        />
      )}
    </>
  );
}

PaymentBuyCurrencyCard.fragments = {
  entry: gql`
    fragment PaymentBuyCurrencyCardSellableItem on StoreV2SellableItem {
      id
      signature
      ...CurrencyCardSellableItem
      ...AdyenOverlaySellableItem
    }
  `,
};
