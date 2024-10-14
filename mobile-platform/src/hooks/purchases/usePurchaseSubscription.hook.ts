import { gql } from '@apollo/client';
import Chargebee, { Customer } from '@chargebee/react-native-chargebee';
import { makeLoggers } from '@noice-com/utils';
import { useState } from 'react';

const logger = makeLoggers('[IAP]');

gql`
  query UserPurchaseInfo($userId: ID!) {
    profile(userId: $userId) {
      userId
      account {
        email
      }
    }
  }
`;

export const usePurchaseSubscription = ({
  customer,
  productId,
}: {
  customer: Customer;
  productId?: string;
}) => {
  const [isPurchaseLoading, setIsPurchaseLoading] = useState(false);

  const purchaseSubscription = async (successCallback?: () => void) => {
    try {
      setIsPurchaseLoading(true);
      if (!productId) {
        throw new Error('Product ID is required to purchase subscription');
      }

      const res = await Chargebee.purchaseProduct(productId, customer);

      // Chargebee types are completely wrong ️🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️, status = true and planId is actually plan_id
      // we check if plan_id is set for success to fire.
      // Luckily at least purchaseProduct throws incase purchase fails/cancels.
      // @ts-ignore
      if (res.plan_id) {
        successCallback?.();
      }
    } catch (error) {
      logger.logError('Failed to purchase subscription', error);
    } finally {
      setIsPurchaseLoading(false);
    }
  };

  return { isPurchaseLoading, purchaseSubscription };
};
