import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';
import { useRef } from 'react';

import { useSubscriptionCheckoutCacheUpdate } from './useSubscriptionCheckoutCacheUpdate.hook';

import { useCheckoutExistingChannelSubscriptionMutation } from '@gen';

gql`
  mutation CheckoutExistingChannelSubscription($channelId: ID!) {
    checkoutExistingChannelSubscription(channelId: $channelId) {
      sessionData
    }
  }
`;

interface HookResult {
  showExistingSubscriptionCheckoutDialog(): void;
}

interface Props {
  channelId: Nullable<string>;
  onError?(): void;
  onSuccess?(): void;
  onModalClose?(): void;
}

export function useExistingSubscriptionCheckoutDialog({
  channelId,
  onError,
  onSuccess,
  onModalClose,
}: Props): HookResult {
  const updateCache = useSubscriptionCheckoutCacheUpdate();

  const [createExistingChannelSubscriptionSession] =
    useCheckoutExistingChannelSubscriptionMutation({
      onError,
    });

  const subscriptionId = useRef<string>();

  const showExistingSubscriptionCheckoutDialog = async () => {
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

        const { data } = await createExistingChannelSubscriptionSession({
          variables: {
            channelId,
          },
        });

        const session = data?.checkoutExistingChannelSubscription?.sessionData ?? '';

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
        onSuccess?.();
      },
      close: () => {
        onModalClose?.();
      },
    });
  };

  return {
    showExistingSubscriptionCheckoutDialog,
  };
}
