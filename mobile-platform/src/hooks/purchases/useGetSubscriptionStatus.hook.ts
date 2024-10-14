import Chargebee, {
  Subscription,
  SubscriptionsRequest,
} from '@chargebee/react-native-chargebee';
import { useEffect, useState } from 'react';

import { iapLogger } from './useSubscriptionById.hook';

export const useGetSubscriptionStatus = () => {
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const getSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const queryParams: SubscriptionsRequest = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        customer_id: 'customer_id',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        subscription_id: 'subscription_id',
        status: 'active',
      };
      const s: Subscription[] = await Chargebee.retrieveSubscriptions(queryParams);

      setSubscriptions(s);
    } catch (error) {
      iapLogger.logError('Failed to get users subscriptions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubscriptionStatus();
  }, []);

  return { subscriptions, loading };
};
