import '@adyen/adyen-web/dist/adyen.css';
import { gql } from '@apollo/client';
import { useMountEffect } from '@noice-com/common-react-core';
import { Anchor, NoiceSupportLinks, useBooleanFeatureFlag } from '@noice-com/common-ui';
import { repromise } from '@noice-com/utils';
import { useRef } from 'react';

import { useAdyenCancelOrderMutation } from '../hooks';

import styles from './AdyenPurchaseContent.module.css';

import { AdyenSession } from '@gen';

const adyenCheckout = repromise(() => import('@adyen/adyen-web'));

gql`
  mutation AdyenContentCancelOrder($orderId: ID!) {
    cancelOrder(orderId: $orderId) {
      emptyTypeWorkaround
    }
  }
`;

interface Props {
  orderId: string;
  session: AdyenSession;
  onPaymentCompleted(): void;
  onPaymentFailed(): void;
}

export function AdyenPurchaseContent({
  orderId,
  session,
  onPaymentCompleted,
  onPaymentFailed: onPaymentFailed,
}: Props) {
  const [showAdyenPurchase] = useBooleanFeatureFlag('adyenPurchase');
  const isMounted = useRef(false);

  // Ref used for mounting the adyen drop-in form
  const adyenContainerRef = useRef<HTMLDivElement>(null);

  const [cancelOrder] = useAdyenCancelOrderMutation({
    onCompleted: onPaymentFailed,
    variables: {
      orderId,
    },
  });

  useMountEffect(() => {
    if (!showAdyenPurchase || isMounted.current) {
      return;
    }

    // Adyen dropin must not be mounted more than once
    isMounted.current = true;

    const createCheckout = async () => {
      const { default: AdyenCheckout } = await adyenCheckout;

      const checkout = await AdyenCheckout({
        clientKey: `${NOICE.ADYEN_CLIENT_KEY}`,
        environment: `${NOICE.ADYEN_ENVIRONMENT}`,
        locale: 'en_US',
        session,
        onPaymentCompleted: (result) => {
          if (result.resultCode === 'Authorised') {
            onPaymentCompleted();
            return;
          }

          cancelOrder();
        },
        onError: () => {
          cancelOrder();
        },
      });

      if (adyenContainerRef.current) {
        checkout.create('dropin').mount(adyenContainerRef.current);
      }
    };

    createCheckout();
  });

  return (
    <div className={styles.adyenContentWrapper}>
      <div className={styles.legalTextWrapper}>
        I request immediate access to my purchase and acknowledge that I will not be able
        to cancel my purchase once the purchase is delivered. If your purchase has not
        been delivered, you can cancel this purchase within 14 days of the purchase date.
        Please note that subscriptions and virtual items are delivered immediately after
        the purchase. By making the purchase, you agree that the purchase is governed by
        the{' '}
        <Anchor
          color="dark"
          href={NoiceSupportLinks.TermsOfService}
        >
          Terms of Service
        </Anchor>{' '}
        for Users. Please read the terms carefully before you proceed.
      </div>

      {showAdyenPurchase ? (
        <div
          className={styles.adyenWrapper}
          ref={adyenContainerRef}
        />
      ) : (
        <div className={styles.adyenDisabled}>
          Item isn&apos;t available for purchase in your region
        </div>
      )}
    </div>
  );
}
