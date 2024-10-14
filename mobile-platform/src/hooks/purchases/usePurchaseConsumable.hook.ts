import { gql } from '@apollo/client';
import { getErrorMessage, makeLoggers } from '@noice-com/utils';
import { useState } from 'react';

import { ConsumableProduct } from './useConsumablePurchases.hook';

import { useToasts } from '@components/Toast/hooks/useToasts.hook';
import {
  StoreV2PaymentMethod,
  useBuyCurrencyPackMutation,
  useCancelBuyCurrencyPackOrderMutation,
} from '@gen/graphql';
import { InstrumentationAnalytics } from '@lib/InstrumentationAnalytics';
import { NoicePurchases } from '@native/NoicePurchasesModule';

gql`
  mutation BuyCurrencyPack(
    $itemId: ID!
    $signature: String!
    $paymentMethod: StoreV2PaymentMethod
  ) {
    buyWithPayment(
      itemId: $itemId
      signature: $signature
      paymentMethod: $paymentMethod
    ) {
      orderId
      session {
        session {
          ... on PaymentAppStoreSession {
            productId
            paymentId
          }
        }
      }
    }
  }

  mutation CancelBuyCurrencyPackOrder($orderId: ID!) {
    cancelOrder(orderId: $orderId) {
      emptyTypeWorkaround
    }
  }
`;

const { logError } = makeLoggers('usePurchaseConsumable');

export const usePurchaseConsumable = () => {
  const [nativePurchaseInProgressId, setNativePurchaseInProgressId] = useState<string>();
  const [mutateStartPurchaseProcess] = useBuyCurrencyPackMutation();
  const [mutateCancelPurchaseProcess] = useCancelBuyCurrencyPackOrderMutation();
  const { addToast } = useToasts();

  const purchaseConsumableProduct = async (
    consumableProduct: ConsumableProduct,
    onComplete: () => void,
  ) => {
    const { data } = await mutateStartPurchaseProcess({
      variables: {
        itemId: consumableProduct.platformProductId,
        signature: consumableProduct.platformProductSignature,
        paymentMethod: StoreV2PaymentMethod.PaymentMethodAppstore,
      },
    });

    if (!data?.buyWithPayment?.orderId) {
      InstrumentationAnalytics.addBreadcrumb({
        message: 'orderId is missing from platform product query',
      });
      return;
    }

    const session = data?.buyWithPayment?.session.session;
    const paymentId =
      session?.__typename === 'PaymentAppStoreSession' && session.paymentId;

    if (!paymentId) {
      InstrumentationAnalytics.addBreadcrumb({
        message: "Couldn't find paymentId in session",
      });
      return;
    }

    setNativePurchaseInProgressId(consumableProduct.id);

    try {
      const resultCode = await NoicePurchases.purchaseProduct(
        consumableProduct.id,
        paymentId,
      );

      if (resultCode === 'FAILED' || resultCode === 'USER_CANCELLED') {
        await mutateCancelPurchaseProcess({
          variables: { orderId: data?.buyWithPayment?.orderId },
        });
      }

      if (resultCode === 'COMPLETE') {
        addToast({
          title: 'Purchase complete!',
          subTitle: `We're processing your purchase.`,
        });
      }

      if (resultCode === 'PENDING') {
        addToast({
          title: 'Purchase is pending.',
        });
      }
    } catch (err) {
      logError(getErrorMessage(err));
      InstrumentationAnalytics.captureException(new Error(getErrorMessage(err)));
    }

    setNativePurchaseInProgressId(undefined);
    onComplete();
  };

  return {
    purchaseConsumableProduct,
    nativePurchaseInProgressId,
  };
};
