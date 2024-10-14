import { gql } from '@apollo/client';
import { Button, CurrencyButton } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { MouseEvent } from 'react';

import { SubscriptionStage } from '../types';

import styles from './SubscriptionModalActions.module.css';

import {
  PaymentCurrency,
  SubscriptionChannelSubscriptionState,
  SubscriptionModalActionsChannelFragment,
} from '@gen';

interface Props {
  stage: SubscriptionStage;
  channel: Nullable<SubscriptionModalActionsChannelFragment>;
  isLoading: boolean;
  subscriptionPrice: number;
  subscriptionCurrency: PaymentCurrency;
  onSubscribeClick(event: MouseEvent<HTMLButtonElement>): void;
  onUpdatePaymentMethodClick(event: MouseEvent<HTMLButtonElement>): void;
  onClose(event: MouseEvent<HTMLButtonElement>): void;
}

export function SubscriptionModalActions({
  stage,
  channel,
  isLoading,
  onSubscribeClick,
  onUpdatePaymentMethodClick,
  onClose,
  subscriptionPrice,
  subscriptionCurrency,
}: Props) {
  if (stage === 'payment') {
    return null;
  }

  if (stage === 'payment-error') {
    return (
      <Button
        fit="content"
        isLoading={isLoading}
        level="primary"
        size="md"
        theme="dark"
        onClick={onUpdatePaymentMethodClick}
      >
        Update payment method
      </Button>
    );
  }

  if (stage === 'reactive') {
    return (
      <Button
        fit="content"
        isLoading={isLoading}
        level="primary"
        size="md"
        theme="dark"
      >
        Reactivating
      </Button>
    );
  }

  if (stage !== 'overview' || !channel) {
    return (
      <Button
        fit="content"
        isLoading={isLoading}
        level="primary"
        size="md"
        theme="dark"
        onClick={onClose}
      >
        Close
      </Button>
    );
  }

  const { subscription } = channel;

  if (
    subscription?.state === SubscriptionChannelSubscriptionState.StateCancelled ||
    subscription?.state === SubscriptionChannelSubscriptionState.StateExpired
  ) {
    return (
      <>
        <div className={styles.footer}>
          <Button
            fit="content"
            isLoading={isLoading}
            size="sm"
            variant="cta"
            onClick={onSubscribeClick}
          >
            Subscribe
          </Button>
        </div>
      </>
    );
  }

  return (
    <CurrencyButton
      currency={{
        currency: subscriptionCurrency,
        type: 'hard',
        value: subscriptionPrice,
      }}
      isLoading={isLoading}
      size="sm"
      onClick={onSubscribeClick}
    >
      Subscribe
    </CurrencyButton>
  );
}

SubscriptionModalActions.fragments = {
  entry: gql`
    fragment SubscriptionModalActionsChannel on ChannelChannel {
      id
      subscription {
        id
        state
      }
    }
  `,
};
