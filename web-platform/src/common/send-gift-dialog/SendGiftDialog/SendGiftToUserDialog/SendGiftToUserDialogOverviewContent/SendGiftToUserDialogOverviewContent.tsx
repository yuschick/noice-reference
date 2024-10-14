import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';

import { OverviewCurrencyContent } from '../../common/SendGiftDialogOverviewContent/OverviewCurrencyContent/OverviewCurrencyContent';
import { OverviewSubscriptionContent } from '../../common/SendGiftDialogOverviewContent/OverviewSubscriptionContent/OverviewSubscriptionContent';
import { getChannelIdFromSellableItem } from '../../utils';
import { SendGiftToUserOverviewState } from '../types';

import {
  StoreV2ItemType,
  useSendGiftToUserDialogOverviewContentChannelQuery,
} from '@gen';

interface Props {
  data: SendGiftToUserOverviewState['data'];
}

gql`
  query SendGiftToUserDialogOverviewContentChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
    }
  }
`;

export const SendGiftToUserDialogOverviewContent = ({ data }: Props) => {
  const { selectedSellableItem, profile } = data;
  const { type } = selectedSellableItem;
  const channelId = getChannelIdFromSellableItem(selectedSellableItem);

  const { data: channelData } = useSendGiftToUserDialogOverviewContentChannelQuery({
    ...variablesOrSkip({ channelId }),
  });

  return (
    <>
      {type === StoreV2ItemType.ItemTypeGiftSubscription && channelData?.channel && (
        <OverviewSubscriptionContent
          profile={profile}
          sellableItem={selectedSellableItem}
        />
      )}

      {type === StoreV2ItemType.ItemTypeCurrencyPack && (
        <OverviewCurrencyContent
          profile={profile}
          sellableItem={selectedSellableItem}
        />
      )}
    </>
  );
};
