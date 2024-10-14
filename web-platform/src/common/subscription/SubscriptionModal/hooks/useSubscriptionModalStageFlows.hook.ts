import { gql } from '@apollo/client';
import { useAnalytics } from '@noice-com/common-ui';
import { DeepPartial, Nullable } from '@noice-com/utils';
import { useCallback, MouseEvent, useState } from 'react';

import {
  useNewSubscriptionCheckoutModal,
  useSubscriptionPaymentMethodDialog,
  useExistingSubscriptionCheckoutDialog,
} from '../../hooks';
import { SubscriptionStage } from '../types';

import {
  ChannelChannel,
  SubscriptionChannelSubscription,
  SubscriptionChannelSubscriptionCancelReason,
  SubscriptionChannelSubscriptionState,
  SubscriptionListUserChannelSubscriptionsResponse,
  SubscriptionModalStageFlowsSubscriptionFragment,
  useReactiveChannelSubscriptionMutation,
} from '@gen';

gql`
  mutation ReactiveChannelSubscription($channelId: ID!) {
    reactivateChannelSubscription(channelId: $channelId) {
      emptyTypeWorkaround
    }
  }

  fragment SubscriptionModalStageFlowsSubscription on SubscriptionChannelSubscription {
    id
    state
    cancelReason
  }
`;

interface Props {
  channelId: Nullable<string>;
  subscription: Nullable<SubscriptionModalStageFlowsSubscriptionFragment>;
  onModalClose(): void;
  onNewSubscriptionCreated(subscriptionId?: string): void;
}

interface HookResult {
  stage: SubscriptionStage;
  isSubscribeButtonLoading: boolean;
  onSubscribeClick(event: MouseEvent<HTMLButtonElement>): void;
  onUpdatePaymentMethodClick(event: MouseEvent<HTMLButtonElement>): void;
}

export function useSubscriptionModalStageFlows({
  channelId,
  subscription,
  onModalClose,
  onNewSubscriptionCreated,
}: Props): HookResult {
  const [stage, setStage] = useState<SubscriptionStage>('overview');

  const { trackButtonClickEventOnMouseClick } = useAnalytics();

  const { showModal } = useNewSubscriptionCheckoutModal({
    channelId,
    onError() {
      setStage('error');
    },
    onSuccess(subscriptionId: string) {
      onNewSubscriptionCreated(subscriptionId);
      setStage('complete');
    },
    onModalClose,
  });

  const { showExistingSubscriptionCheckoutDialog } =
    useExistingSubscriptionCheckoutDialog({
      channelId,
      onError() {
        setStage('error');
      },
      onSuccess() {
        setStage('complete');
      },
      onModalClose,
    });

  const [reactiveSubscription, { loading: isSubscribeButtonLoading }] =
    useReactiveChannelSubscriptionMutation({
      onCompleted() {
        setStage('complete');
      },
      onError(error) {
        const errorData = JSON.parse(error.message);

        if (errorData.api_error_code === 'payment_processing_failed') {
          setStage('payment-error');
          return;
        }

        setStage('error');
      },
      update(cache) {
        // Update channel's subscription state
        cache.updateFragment<DeepPartial<ChannelChannel>>(
          {
            id: cache.identify({
              id: channelId,
              __typename: 'ChannelChannel',
            }),
            fragment: gql`
              fragment ReactiveSubscriptionChannel on ChannelChannel {
                id
                subscription {
                  id
                  state
                }
              }
            `,
          },
          (existing) => {
            if (!existing) {
              return existing;
            }

            return {
              ...existing,
              subscription: {
                ...existing?.subscription,
                state: SubscriptionChannelSubscriptionState.StateActive,
              },
            };
          },
        );

        // Update the subscription state
        cache.updateFragment<DeepPartial<SubscriptionChannelSubscription>>(
          {
            id: cache.identify({
              id: subscription?.id,
              __typename: 'SubscriptionChannelSubscription',
            }),
            fragment: gql`
              fragment ReactiveSubscriptionChannelSubscription on SubscriptionChannelSubscription {
                id
                state
              }
            `,
          },
          (existing) => ({
            ...existing,
            state: SubscriptionChannelSubscriptionState.StateActive,
          }),
        );

        if (subscription?.state === SubscriptionChannelSubscriptionState.StateExpired) {
          // Update the user's subscription lists
          cache.modify({
            fields: {
              userChannelSubscriptions(
                existing: Partial<SubscriptionListUserChannelSubscriptionsResponse>,
                { storeFieldName, readField, toReference },
              ) {
                // Remove the subscription to the cancelled list
                if (
                  storeFieldName.includes(
                    SubscriptionChannelSubscriptionState.StateExpired,
                  )
                ) {
                  return {
                    ...existing,
                    subscriptions: existing?.subscriptions?.filter(
                      (existingSubscription) =>
                        readField('id', existingSubscription) !== subscription?.id,
                    ),
                  };
                }

                // Add the subscription from the active list
                if (
                  storeFieldName.includes(
                    SubscriptionChannelSubscriptionState.StateActive,
                  )
                ) {
                  return {
                    ...existing,
                    subscriptions: [
                      ...(existing?.subscriptions ?? []),
                      toReference({
                        id: subscription?.id,
                        __typename: 'SubscriptionChannelSubscription',
                      }),
                    ],
                  };
                }

                return existing;
              },
            },
          });
        }
      },
    });

  const onSubscribeClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      trackButtonClickEventOnMouseClick(event, 'subscription-modal');

      if (!channelId) {
        setStage('error');
        return;
      }

      if (subscription?.state === SubscriptionChannelSubscriptionState.StateCancelled) {
        // If the subscription was cancelled due to no card or not paid, show the existing subscription checkout dialog
        if (
          subscription.cancelReason ===
            SubscriptionChannelSubscriptionCancelReason.CancelReasonNoCard ||
          subscription.cancelReason ===
            SubscriptionChannelSubscriptionCancelReason.CancelReasonNotPaid
        ) {
          setStage('payment');
          showExistingSubscriptionCheckoutDialog();
          return;
        }

        // If the subscription was cancelled due to other reasons, use the reactive flow
        reactiveSubscription({ variables: { channelId } });
        return;
      }

      if (subscription?.state === SubscriptionChannelSubscriptionState.StateExpired) {
        setStage('payment');
        showExistingSubscriptionCheckoutDialog();
        return;
      }

      setStage('payment');
      showModal();
    },
    [
      trackButtonClickEventOnMouseClick,
      channelId,
      subscription?.state,
      subscription?.cancelReason,
      showModal,
      reactiveSubscription,
      showExistingSubscriptionCheckoutDialog,
    ],
  );

  const { showModal: showPaymentModal } = useSubscriptionPaymentMethodDialog({
    onModalClose() {
      if (!channelId) {
        setStage('error');
        return;
      }

      setStage('reactive');
      reactiveSubscription({ variables: { channelId } });
    },
  });

  const onUpdatePaymentMethodClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      trackButtonClickEventOnMouseClick(event, 'subscription-modal');
      setStage('payment');
      showPaymentModal();
    },
    [showPaymentModal, trackButtonClickEventOnMouseClick],
  );

  return {
    stage,
    isSubscribeButtonLoading,
    onSubscribeClick,
    onUpdatePaymentMethodClick,
  };
}
