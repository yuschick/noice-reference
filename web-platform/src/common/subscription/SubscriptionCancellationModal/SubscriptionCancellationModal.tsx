import { gql } from '@apollo/client';
import {
  Button,
  Dialog,
  LoadingSkeleton,
  useAnalytics,
  useDialog,
} from '@noice-com/common-ui';

import styles from './SubscriptionCancellationModal.module.css';
import { SubscriptionCancellationModalActions } from './SubscriptionCancellationModalActions/SubscriptionCancellationModalActions';
import { SubscriptionCancellationModalContent } from './SubscriptionCancellationModalContent/SubscriptionCancellationModalContent';

import { useSubscriptionCancellationModalChannelQuery } from '@gen';

gql`
  query SubscriptionCancellationModalChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      subscription {
        id
        ...SubscriptionCancellationModalContentSubscription
        ...SubscriptionCancellationModalActionsSubscription
      }
      ...SubscriptionCancellationModalContentChannel
      ...SubscriptionCancellationModalActionsChannel
    }
  }
`;

interface Props {
  channelId: string;
  onClose: () => void;
}

export function SubscriptionCancellationModal({ channelId, onClose }: Props) {
  const { trackButtonClickEvent } = useAnalytics();
  const { data, loading } = useSubscriptionCancellationModalChannelQuery({
    variables: { channelId },
  });

  const dialog = useDialog({
    initialState: 'open',
    title: 'Cancel Subscription',
    onClose() {
      trackButtonClickEvent('Close', { section: 'subscription-cancel-dialog' });
      onClose();
    },
  });

  const channel = data?.channel;

  return (
    <Dialog store={dialog}>
      <Dialog.Header />
      <Dialog.Close />

      <Dialog.Content>
        {loading ? (
          <LoadingSkeleton count={3} />
        ) : (
          <div className={styles.contentWrapper}>
            <SubscriptionCancellationModalContent
              channel={channel ?? null}
              subscription={channel?.subscription ?? null}
            />
          </div>
        )}
      </Dialog.Content>

      <Dialog.Actions>
        {loading ? (
          <Button
            theme="dark"
            isLoading
          >
            Cancel subscription
          </Button>
        ) : (
          <SubscriptionCancellationModalActions
            channel={channel ?? null}
            closeDialog={dialog.actions.close}
            subscription={channel?.subscription ?? null}
            onClose={onClose}
          />
        )}
      </Dialog.Actions>
    </Dialog>
  );
}
