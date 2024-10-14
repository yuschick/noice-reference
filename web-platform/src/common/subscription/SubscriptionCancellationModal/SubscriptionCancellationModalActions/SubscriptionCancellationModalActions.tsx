import { gql } from '@apollo/client';
import { Button, ButtonLink, NoiceSupportLinks } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';

import { ChargebeeSubscriptionCancellationModalActions } from './ChargebeeSubscriptionCancellationModalActions';

import {
  SubscriptionCancellationModalActionsChannelFragment,
  SubscriptionCancellationModalActionsSubscriptionFragment,
  SubscriptionChannelSubscriptionProvider,
} from '@gen';

gql`
  fragment SubscriptionCancellationModalActionsSubscription on SubscriptionChannelSubscription {
    id
    provider
    ...ChargebeeSubscriptionCancellationModalActionsSubscription
  }

  fragment SubscriptionCancellationModalActionsChannel on ChannelChannel {
    ...ChargebeeSubscriptionCancellationModalActionsChannel
  }
`;

interface Props {
  channel: Nullable<SubscriptionCancellationModalActionsChannelFragment>;
  subscription: Nullable<SubscriptionCancellationModalActionsSubscriptionFragment>;
  onClose(): void;
  closeDialog(): void;
}

export function SubscriptionCancellationModalActions({
  channel,
  subscription,
  onClose,
  closeDialog,
}: Props) {
  if (!subscription || !channel) {
    return (
      <ButtonLink
        theme="dark"
        to={`mailto:${NoiceSupportLinks.SupportEmail}`}
      >
        Contact Support
      </ButtonLink>
    );
  }

  const { provider } = subscription;

  if (provider === SubscriptionChannelSubscriptionProvider.ProviderChargebee) {
    return (
      <ChargebeeSubscriptionCancellationModalActions
        channel={channel}
        closeDialog={closeDialog}
        subscription={subscription}
        onClose={onClose}
      />
    );
  }

  if (provider === SubscriptionChannelSubscriptionProvider.ProviderApple) {
    return (
      <Button
        fit="content"
        theme="dark"
        onClick={closeDialog}
      >
        Close
      </Button>
    );
  }

  return (
    <ButtonLink
      theme="dark"
      to={`mailto:${NoiceSupportLinks.SupportEmail}`}
    >
      Contact Support
    </ButtonLink>
  );
}
