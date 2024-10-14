import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';

import { SendGiftToUserProfile } from '../../../SendGiftToUserDialog/SendGiftToUserProfile';
import { getChannelIdFromSellableItem } from '../../../utils';

import {
  OverviewSubscriptionContentSellableItemFragment,
  SendGiftToUserProfileFragment,
  useOverviewSubscriptionContentChannelQuery,
} from '@gen';

gql`
  fragment OverviewSubscriptionContentSellableItem on StoreV2SellableItem {
    ...GiftSubscriptionGetChannelIdSellableItem
  }

  query OverviewSubscriptionContentChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
    }
  }
`;

interface Props {
  profile: SendGiftToUserProfileFragment;
  sellableItem: OverviewSubscriptionContentSellableItemFragment;
}

export function OverviewSubscriptionContent({ sellableItem, profile }: Props) {
  const channelId = getChannelIdFromSellableItem(sellableItem);

  const { data } = useOverviewSubscriptionContentChannelQuery({
    ...variablesOrSkip({ channelId }),
  });

  if (!data?.channel) {
    return null;
  }

  const { channel } = data;
  const { name } = channel;

  return (
    <>
      <SendGiftToUserProfile
        profile={profile}
        title={`Gift a ${name} subscription to`}
      />

      <section>
        <p>By gifting a subscription you&apos;ll support {name}.</p>
      </section>
    </>
  );
}
