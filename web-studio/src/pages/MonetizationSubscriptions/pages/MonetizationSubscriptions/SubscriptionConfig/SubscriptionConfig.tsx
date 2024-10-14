import { gql } from '@apollo/client';
import { Switch } from '@noice-com/common-ui';

import { SubscriptionSection } from '../../../SubscriptionSection/SubscriptionSection';

import { useChannelContext } from '@common/channel';
import {
  ChannelSubscriptionSettingSubscriptionConfigFragment,
  useChannelUpdateSubscriptionConfigMutation,
} from '@gen';

gql`
  fragment ChannelSubscriptionSettingSubscriptionConfig on SubscriptionChannelSubscriptionConfig {
    subscriptionsEnabled
  }

  mutation ChannelUpdateSubscriptionConfig(
    $channelId: ID!
    $subscriptionsEnabled: Boolean!
  ) {
    updateChannelSubscriptionConfig(
      channelId: $channelId
      subscriptionsEnabled: $subscriptionsEnabled
    ) {
      channelId
      subscriptionsEnabled
    }
  }
`;

export function SubscriptionConfig({
  subscriptionsEnabled,
}: ChannelSubscriptionSettingSubscriptionConfigFragment) {
  const { channelId, monetizationSettings } = useChannelContext();
  const [updateSubscriptionConfig, { loading }] =
    useChannelUpdateSubscriptionConfigMutation();
  const description = subscriptionsEnabled
    ? 'Users can subscribe to your channel.'
    : 'Users cannot subscribe to your channel. Existing subscriptions stay active.';

  return (
    <SubscriptionSection
      description={description}
      label="Channel subscriptions"
    >
      <Switch
        checked={subscriptionsEnabled}
        disabled={!monetizationSettings?.enabled}
        isLoading={loading}
        label="Channel subscriptions"
        labelType="hidden"
        onChange={(event) =>
          updateSubscriptionConfig({
            variables: { channelId, subscriptionsEnabled: event.target.checked },
          })
        }
      />
    </SubscriptionSection>
  );
}
