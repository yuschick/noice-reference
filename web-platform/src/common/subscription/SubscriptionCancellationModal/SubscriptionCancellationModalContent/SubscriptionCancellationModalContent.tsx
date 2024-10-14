import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';

import { ChargebeeSubscriptionCancellationModalContent } from './ChargebeeSubscriptionCancellationModalContent';

import { SubscriptionDialogChannelContent } from '@common/subscription/SubscriptionDialogChannelContent';
import {
  SubscriptionCancellationModalContentChannelFragment,
  SubscriptionCancellationModalContentSubscriptionFragment,
  SubscriptionChannelSubscriptionProvider,
} from '@gen';

gql`
  fragment SubscriptionCancellationModalContentSubscription on SubscriptionChannelSubscription {
    id
    provider
    ...ChargebeeSubscriptionCancellationModalContentSubscription
  }

  fragment SubscriptionCancellationModalContentChannel on ChannelChannel {
    id
    ...SubscriptionDialogChannelContentChannel
    ...ChargebeeSubscriptionCancellationModalContentChannel
  }
`;

interface Props {
  subscription: Nullable<SubscriptionCancellationModalContentSubscriptionFragment>;
  channel: Nullable<SubscriptionCancellationModalContentChannelFragment>;
}

export function SubscriptionCancellationModalContent({ channel, subscription }: Props) {
  if (!channel || !subscription) {
    return (
      <>
        We were unable to cancel your subscription due to an unexpected error on our end.
        Please reach out to customer support so we can assist you with this issue.
      </>
    );
  }

  const { provider } = subscription;

  if (provider === SubscriptionChannelSubscriptionProvider.ProviderChargebee) {
    return (
      <>
        <SubscriptionDialogChannelContent channel={channel} />

        <ChargebeeSubscriptionCancellationModalContent
          channel={channel}
          subscription={subscription}
        />
      </>
    );
  }

  if (provider === SubscriptionChannelSubscriptionProvider.ProviderApple) {
    return (
      <>
        <SubscriptionDialogChannelContent channel={channel} />
        To cancel this subscription, go to your Subscription Management on your iOS
        device.
      </>
    );
  }

  return (
    <>
      We were unable to cancel your subscription due to an unexpected error on our end.
      Please reach out to customer support so we can assist you with this issue.
    </>
  );
}
