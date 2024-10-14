import { gql } from '@apollo/client';
import { CategoryFilter, ChannelLogo, useAuthenticatedUser } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useState } from 'react';

import styles from './ChannelSelector.module.css';

import {
  CollectionChannelSelectorChannelFragment,
  ItemItemType,
  useCollectionChannelSelectorChannelsLazyQuery,
  useCollectionChannelSelectorInventoryQuery,
} from '@gen';

gql`
  query CollectionChannelSelectorInventory(
    $userId: ID
    $filters: [InventoryListUserInventoryRequestFilterInput!]
  ) {
    inventory(filters: $filters, userId: $userId) {
      items {
        itemId
        item {
          id
          channelId
        }
      }
    }
  }

  fragment CollectionChannelSelectorChannel on ChannelChannel {
    id
    name
    ...ChannelLogoChannel
  }

  query CollectionChannelSelectorChannels($channelIds: [String!]) {
    getChannels(channelIds: $channelIds) {
      channels {
        ...CollectionChannelSelectorChannel
      }
    }
  }
`;

interface Props {
  gameId: Nullable<string>;
  channelId: Nullable<string>;
  onSelectChannel(channelId: Nullable<string>): void;
}

export function ChannelSelector({ gameId, channelId, onSelectChannel }: Props) {
  const { userId } = useAuthenticatedUser();
  const [channels, setChannels] =
    useState<Nullable<CollectionChannelSelectorChannelFragment[]>>(null);

  const [fetchChannels, { loading: channelsDataLoading }] =
    useCollectionChannelSelectorChannelsLazyQuery();

  const { loading: inventoryDataLoading } = useCollectionChannelSelectorInventoryQuery({
    variables: {
      userId,
      filters: [{ itemType: ItemItemType.TypeStreamerCard }, { gameId }],
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: async (inventoryData) => {
      const channelIdsWithStreamerCards = (inventoryData?.inventory?.items ?? []).reduce(
        (prev: string[], curr) =>
          prev.includes(curr.item.channelId) ? prev : prev.concat(curr.item.channelId),
        [],
      );

      const { data: channelData } = await fetchChannels({
        variables: { channelIds: channelIdsWithStreamerCards },
        fetchPolicy: 'cache-and-network',
      });

      setChannels(channelData?.getChannels?.channels ?? []);
    },
  });

  if (!gameId) {
    return null;
  }

  return (
    <CategoryFilter
      loading={channelsDataLoading || inventoryDataLoading}
      title="Channel selection"
    >
      <CategoryFilter.Button
        isSelected={!channelId}
        onClick={() => onSelectChannel(null)}
      >
        <div className={styles.allCardsLabel}>All cards</div>
      </CategoryFilter.Button>
      {!!channels?.length &&
        channels.map((channel) => {
          return (
            <CategoryFilter.Button
              isSelected={channelId === channel.id}
              key={channel.id}
              onClick={() => onSelectChannel(channel.id)}
            >
              <div className={styles.channelContent}>
                <ChannelLogo
                  channel={channel}
                  size="xs"
                />
                <span className={styles.channelName}>{channel.name}</span>
              </div>
            </CategoryFilter.Button>
          );
        })}
    </CategoryFilter>
  );
}
