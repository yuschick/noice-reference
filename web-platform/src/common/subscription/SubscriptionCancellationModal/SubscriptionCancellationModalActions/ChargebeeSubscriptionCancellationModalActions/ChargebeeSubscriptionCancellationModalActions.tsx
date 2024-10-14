import { gql } from '@apollo/client';
import { Button, useAnalytics } from '@noice-com/common-ui';
import { DeepPartial } from '@noice-com/utils';

import styles from './ChargebeeSubscriptionCancellationModalActions.module.css';

import {
  useActiveSubscriptionMenuCancelMutation,
  SubscriptionChannelSubscriptionState,
  SubscriptionChannelSubscription,
  ChargebeeSubscriptionCancellationModalActionsChannelFragment,
  ChargebeeSubscriptionCancellationModalActionsSubscriptionFragment,
} from '@gen';

gql`
  mutation ActiveSubscriptionMenuCancel($channelId: ID!) {
    cancelChannelSubscription(channelId: $channelId) {
      emptyTypeWorkaround
    }
  }

  fragment ChargebeeSubscriptionCancellationModalActionsChannel on ChannelChannel {
    id
  }

  fragment ChargebeeSubscriptionCancellationModalActionsSubscription on SubscriptionChannelSubscription {
    id
  }
`;

interface Props {
  channel: ChargebeeSubscriptionCancellationModalActionsChannelFragment;
  subscription: ChargebeeSubscriptionCancellationModalActionsSubscriptionFragment;
  onClose(): void;
  closeDialog(): void;
}

export function ChargebeeSubscriptionCancellationModalActions({
  channel,
  subscription,
  onClose,
  closeDialog,
}: Props) {
  const { trackButtonClickEventOnMouseClick } = useAnalytics();

  const { id: channelId } = channel;
  const { id: subscriptionId } = subscription;

  const [cancelSubscription, { loading }] = useActiveSubscriptionMenuCancelMutation({
    variables: { channelId },
    update: (cache) => {
      cache.updateFragment<DeepPartial<SubscriptionChannelSubscription>>(
        {
          id: cache.identify({
            id: subscriptionId,
            __typename: 'SubscriptionChannelSubscription',
          }),

          fragment: gql`
            fragment ActiveMenuCancelUpdateSubscription on SubscriptionChannelSubscription {
              id
              state
            }
          `,
        },
        (existing) => ({
          ...existing,
          state: SubscriptionChannelSubscriptionState.StateCancelled,
        }),
      );
    },
    onCompleted: () => {
      closeDialog();

      onClose();
    },
  });

  return (
    <div className={styles.actions}>
      <Button
        isLoading={loading}
        theme="dark"
        onClick={(event) => {
          cancelSubscription();
          trackButtonClickEventOnMouseClick(event, 'subscription-cancel-dialog');
        }}
      >
        Cancel subscription
      </Button>
    </div>
  );
}
