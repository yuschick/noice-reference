import { gql } from '@apollo/client';
import Chargebee, { Customer, Product } from '@chargebee/react-native-chargebee';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { makeLoggers } from '@noice-com/utils';
import { useCallback, useState } from 'react';

import { useUserPurchaseInfoQuery } from '@gen/graphql';
import { useAsyncEffect } from '@hooks/useAsyncEffect.hook';
import { useAuth } from '@hooks/useAuth.hook';

export const iapLogger = makeLoggers('[IAP]');

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

export const useSubscriptionById = (channelId: string) => {
  const { userId } = useAuth();
  const { data, loading: purchaseInfoLoading } = useUserPurchaseInfoQuery({
    ...variablesOrSkip({ userId }),
  });

  const [productLoading, setProductLoading] = useState(true);
  const [product, setProduct] = useState<Product>();

  const productId = `${channelId.replace(/-/g, '_')}_1_month_tier_1`;

  const fetchProduct = useCallback(async () => {
    setProductLoading(true);
    try {
      const products = await Chargebee.retrieveProducts([productId]);
      setProduct(products[0]);
    } catch (error) {
      iapLogger.logError('Failed to get product', error);
    } finally {
      setProductLoading(false);
    }
  }, [productId]);

  useAsyncEffect(fetchProduct);

  const isLoading = purchaseInfoLoading || productLoading;
  const customer: Customer = {
    id: userId ?? '',
    email: data?.profile?.account?.email ?? '',
  };

  return { product, isLoading, customer };
};
