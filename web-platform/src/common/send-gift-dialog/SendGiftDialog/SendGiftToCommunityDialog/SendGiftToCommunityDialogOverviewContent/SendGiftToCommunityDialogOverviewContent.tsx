import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';

import { getCommunityGiftProductName } from '../../SendGiftToCommunityDialog';
import { getChannelIdFromSellableItem } from '../../utils';
import { SendGiftToCommunityOverviewState } from '../types';

import styles from './SendGiftToCommunityDialogOverviewContent.module.css';

import { getFormattedPricesWithCurrency } from '@common/currency';
import { SelectableSellableItem, SellableItemChoice } from '@common/sellable-item';
import { SubscriptionDialogChannelContent } from '@common/subscription';
import {
  StoreV2ItemType,
  StoreV2SubscriptionRef,
  useSendGiftToCommunityDialogOverviewContentChannelQuery,
} from '@gen';

interface Props {
  data: SendGiftToCommunityOverviewState['data'];
  onSelectItem: (id: string) => void;
}

gql`
  query SendGiftToCommunityDialogOverviewContentChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      ...SubscriptionDialogChannelContentChannel
    }
  }
`;

export const SendGiftToCommunityDialogOverviewContent = ({
  data,
  onSelectItem,
}: Props) => {
  const { selectedSellableItem } = data;
  const { type } = selectedSellableItem;
  const channelId = getChannelIdFromSellableItem(selectedSellableItem);

  const { data: channelData } = useSendGiftToCommunityDialogOverviewContentChannelQuery({
    ...variablesOrSkip({ channelId }),
  });

  if (!channelData?.channel) {
    return null;
  }

  const channelName = channelData.channel.name;

  const items: SelectableSellableItem[] = data.sellableItems
    .filter(({ content }) => content[0]?.value?.__typename === 'StoreV2SubscriptionRef')
    .map(({ id, price, content }) => {
      const { formattedPrice, formattedOriginalPrice } =
        getFormattedPricesWithCurrency(price);

      return {
        id,
        itemName: `Gift ${getCommunityGiftProductName(
          (content[0].value as StoreV2SubscriptionRef).amount,
        )}`,
        icon: CoreAssets.Icons.Gift,
        iconColor: 'magenta-main',
        formattedOriginalPrice,
        formattedPrice,
      };
    });

  return (
    <>
      {type === StoreV2ItemType.ItemTypeGiftSubscription && (
        <div className={styles.overviewContent}>
          <SubscriptionDialogChannelContent channel={channelData.channel} />
          <div>Support {channelName} by gifting a subscription!</div>
          <div>
            <div className={styles.title}>Select gift</div>
            <div className={styles.subtitle}>
              Watch as Noice plays sub fairy, blessing lucky recipients in the community
              with a month of awesome perks!
            </div>
          </div>
          <SellableItemChoice
            items={items}
            selectedItemId={data.selectedSellableItem.id}
            onSelect={onSelectItem}
          />
        </div>
      )}
    </>
  );
};
