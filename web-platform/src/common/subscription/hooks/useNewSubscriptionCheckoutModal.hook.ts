import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';
import { useRef } from 'react';

import { useSubscriptionCheckoutCacheUpdate } from './useSubscriptionCheckoutCacheUpdate.hook';

import { useCheckoutNewChannelSubscriptionMutation } from '@gen';

gql`
  mutation CheckoutNewChannelSubscription($channelId: ID!, $tier: Int) {
    checkoutNewChannelSubscription(channelId: $channelId, tier: $tier) {
      sessionData
    }
  }
`;

interface HookResult {
  showModal(): void;
}

interface Props {
  channelId: Nullable<string>;
  onError?(): void;
  onSuccess?(subscriptionId?: string): void;
  onModalClose?(): void;
}

export function useNewSubscriptionCheckoutModal({
  channelId,
  onError,
  onSuccess,
  onModalClose,
}: Props): HookResult {
  const updateCache = useSubscriptionCheckoutCacheUpdate();

  const subscriptionId = useRef<string>();

  const [createNewChannelSubscriptionSession] = useCheckoutNewChannelSubscriptionMutation(
    {
      onError,
    },
  );

  const showModal = async () => {
    /* @ts-ignore-next-line */
    Chargebee.init({
      site: NOICE.CHARGEBEE_SITE,
    });

    /* @ts-ignore-next-line */
    const cbInstance = Chargebee.getInstance();
    cbInstance.openCheckout({
      hostedPage: async () => {
        if (!channelId) {
          onError?.();
          return null;
        }

        const { data } = await createNewChannelSubscriptionSession({
          variables: {
            channelId,
            tier: 1,
          },
        });

        const session = data?.checkoutNewChannelSubscription?.sessionData ?? '';

        const decoded = window.atob(session);
        const parsed = JSON.parse(decoded);

        subscriptionId.current = parsed.id;

        return parsed;
      },
      success: () => {
        // We do not need chargebee modal anymore
        cbInstance.closeAll();
        // Update cache
        if (subscriptionId.current && channelId) {
          updateCache(channelId, subscriptionId.current);
        }
        onSuccess?.(subscriptionId.current);
      },
      close: () => {
        onModalClose?.();
      },
    });
  };

  return { showModal };
}
