import { gql } from '@apollo/client';
import {
  Button,
  Dialog,
  LoadingSkeleton,
  useAnalytics,
  useConversionEvents,
  useDialog,
} from '@noice-com/common-ui';
import { MouseEvent, useCallback, useEffect, useRef } from 'react';

import { SubscriptionDialogChannelContent } from '../SubscriptionDialogChannelContent';

import { CompleteStage } from './CompleteStage/CompleteStage';
import { ErrorStage } from './ErrorStage/ErrorStage';
import { useSubscriptionModalStageFlows } from './hooks/useSubscriptionModalStageFlows.hook';
import { OverviewStage } from './OverviewStage/OverviewStage';
import { PaymentErrorStage } from './PaymentErrorStage/PaymentErrorStage';
import styles from './SubscriptionModal.module.css';
import { SubscriptionModalActions } from './SubscriptionModalActions/SubscriptionModalActions';

import { SubscriptionPurchaseCurrency } from '@common/subscription/SubscriptionModal/utils';
import {
  PaymentCurrency,
  SubscriptionSubscriptionPricePeriod,
  useChargebeeSubscriptionModelChannelQuery,
} from '@gen';

gql`
  query ChargebeeSubscriptionModelChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      subscriptionConfig {
        channelId
        tiers {
          level
          prices {
            period
            price
            currency
          }
        }
      }
      subscription {
        id
        ...SubscriptionModalStageFlowsSubscription
      }

      ...SubscriptionDialogChannelContentChannel
      ...SubscriptionModalOverviewStageChannel
      ...SubscriptionModalCompleteStageChannel
      ...SubscriptionModalActionsChannel
    }
  }
`;

interface Props {
  channelId: string;
  handleModalCloseCallback: () => void;
}

export function ChargebeeSubscriptionModal({
  channelId,
  handleModalCloseCallback,
}: Props) {
  const { sendItemPurchasedConversionEvent } = useConversionEvents();
  const { trackButtonClickEventOnMouseClick, trackButtonClickEvent } = useAnalytics();

  const preventCloseCallback = useRef(false);

  const { data, loading } = useChargebeeSubscriptionModelChannelQuery({
    variables: {
      channelId,
    },
  });

  const channel = data?.channel;

  const price = channel?.subscriptionConfig?.tiers
    .find(({ level }) => level === 1)
    ?.prices.find(
      ({ period }) => period === SubscriptionSubscriptionPricePeriod.PeriodMonth,
    );

  const subscriptionPrice = price?.price ?? 0;
  const subscriptionCurrency = price?.currency ?? PaymentCurrency.CurrencyEur;

  const {
    stage,
    isSubscribeButtonLoading,
    onSubscribeClick,
    onUpdatePaymentMethodClick,
  } = useSubscriptionModalStageFlows({
    channelId: channel?.id ?? null,
    onModalClose: handleModalCloseCallback,
    onNewSubscriptionCreated(subscriptionId: string) {
      sendItemPurchasedConversionEvent({
        contentType: 'channel-subscription',
        contentId: subscriptionId,
        currency: SubscriptionPurchaseCurrency,
        value: subscriptionPrice,
      });
    },
    subscription: channel?.subscription ?? null,
  });

  const dialog = useDialog({
    initialState: 'open',
    title: 'Channel Subscription',
    onClose: () => {
      // Do nothing if we're preventing the modal from closing
      if (preventCloseCallback.current) {
        return;
      }

      trackButtonClickEvent('Close', { section: 'subscription-modal' });

      handleModalCloseCallback();
    },
  });

  useEffect(() => {
    if (stage === 'payment') {
      // Chargebee renders modal for us so close our modal,
      // but prevent it from unmounting the component all together
      preventCloseCallback.current = true;
      dialog.actions.close();
      return;
    }

    if (stage === 'complete' || stage === 'error' || stage === 'reactive') {
      // Re-open the modal to and allow normal close functionality
      dialog.actions.open();
      preventCloseCallback.current = false;
      return;
    }
  }, [dialog.actions, stage]);

  const onActionCloseClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      trackButtonClickEventOnMouseClick(event, `subscription-modal-${stage}-stage`);

      handleModalCloseCallback();
    },
    [handleModalCloseCallback, stage, trackButtonClickEventOnMouseClick],
  );

  return (
    <Dialog store={dialog}>
      <Dialog.Header />
      <Dialog.Close />

      <Dialog.Content>
        <div className={styles.contentWrapper}>
          {loading ? (
            <LoadingSkeleton count={3} />
          ) : (
            <>
              {channel && (
                <>
                  <SubscriptionDialogChannelContent channel={channel} />

                  {stage === 'overview' && <OverviewStage channel={channel} />}

                  {stage === 'complete' && <CompleteStage channel={channel} />}

                  {stage === 'payment-error' && <PaymentErrorStage />}
                </>
              )}

              {(stage === 'error' || !channel) && <ErrorStage />}
            </>
          )}
        </div>
      </Dialog.Content>

      <Dialog.Actions>
        {loading ? (
          <Button isLoading>Close</Button>
        ) : (
          <SubscriptionModalActions
            channel={channel ?? null}
            isLoading={isSubscribeButtonLoading}
            stage={stage}
            subscriptionCurrency={subscriptionCurrency}
            subscriptionPrice={subscriptionPrice}
            onClose={onActionCloseClick}
            onSubscribeClick={onSubscribeClick}
            onUpdatePaymentMethodClick={onUpdatePaymentMethodClick}
          />
        )}
      </Dialog.Actions>
    </Dialog>
  );
}
