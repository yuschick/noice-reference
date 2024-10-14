import { gql } from '@apollo/client';
import { useClient, useConditionalOnce } from '@noice-com/common-react-core';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useState } from 'react';

import {
  CreatorCardGridStreamerCardFragment,
  ItemItemType,
  useCollectionChannelCardGridGameLazyQuery,
  useUseCreatorCardsItemsLazyQuery,
} from '@gen';
import { canPurchaseSaleConfig } from '@pages/Collection/utils';

gql`
  query CollectionChannelCardGridGame($gameId: ID!) {
    game(id: $gameId) {
      id
      activeSeason {
        id
      }
    }
  }

  query UseCreatorCardsItems(
    $filters: [ItemListItemsRequestFilterInput!]
    $seasonId: String!
    $userId: ID!
  ) {
    items(filters: $filters) {
      items {
        id
        details {
          __typename
          ... on GameLogicStreamerCard {
            ...CreatorCardGridStreamerCard
            saleConfig {
              cardId
              channelId
              enabled
              period {
                from
                until
              }
            }
          }
        }
        inventoryItem(user_id: $userId) {
          itemId
          itemCount
          item {
            id
          }
        }
      }
    }
  }
`;

interface Props {
  gameId: Nullable<string>;
  channelId: Nullable<string>;
  seasonId: Nullable<string>;
}

interface Cards {
  activeCards: Nullable<CreatorCardGridStreamerCardFragment[]>;
  seasonCards: Nullable<CreatorCardGridStreamerCardFragment[]>;
  ownedCards: Nullable<string[]>;
}

interface HookResult {
  cards: Nullable<Cards>;
  loading: boolean;
  refetch(): Promise<void>;
}

export function useCreatorCards({ gameId, channelId, seasonId }: Props): HookResult {
  const client = useClient();
  const { userId } = useAuthenticatedUser();
  const [cards, setCards] = useState<Nullable<Cards>>(null);

  const [fetchItems, { loading: loadingCardsInPlay }] =
    useUseCreatorCardsItemsLazyQuery();

  const [fetchGame, { loading: loadingGame }] =
    useCollectionChannelCardGridGameLazyQuery();

  const updateCreatorCards = useCallback(async () => {
    if (!gameId) {
      return;
    }

    const { data: gameData } = await fetchGame({
      variables: { gameId },
      fetchPolicy: 'cache-and-network',
    });

    if (!gameData?.game) {
      return;
    }

    const activeSeasonId = gameData.game.activeSeason.id;

    const { data: activeSeasonItemsData } = await fetchItems({
      variables: {
        seasonId: activeSeasonId,
        userId,
        filters: [{ itemType: ItemItemType.TypeStreamerCard }, { gameId }, { channelId }],
      },
      fetchPolicy: 'cache-and-network',
    });

    const streamerCardsInPlay: CreatorCardGridStreamerCardFragment[] = [];

    activeSeasonItemsData?.items?.items.forEach((item) => {
      if (
        item.details?.__typename !== 'GameLogicStreamerCard' ||
        !item.details.baseCard
      ) {
        return;
      }

      const activeStreamerCard = item.details.baseCard.activeStreamerCards.find(
        (card) =>
          card.channel.id === channelId &&
          !streamerCardsInPlay.find((existingCard) => existingCard.id === card.id),
      );

      if (!activeStreamerCard) {
        return;
      }

      streamerCardsInPlay.push({
        baseCard: item.details.baseCard,
        ...activeStreamerCard,
      });
    });

    if (!seasonId) {
      return;
    }

    const { data: selectedSeasonItemsData } = await fetchItems({
      variables: {
        seasonId,
        userId,
        filters: [{ itemType: ItemItemType.TypeStreamerCard }, { gameId }, { channelId }],
      },
    });

    const seasonStreamerCards: CreatorCardGridStreamerCardFragment[] = [];
    const ownedCards: string[] = [];

    selectedSeasonItemsData?.items?.items.forEach((item) => {
      if (
        item.details?.__typename !== 'GameLogicStreamerCard' ||
        !item.details.baseCard
      ) {
        return;
      }

      const canPurchaseCard = canPurchaseSaleConfig(item.details.saleConfig);

      if (!canPurchaseCard && !item.inventoryItem.itemCount) {
        return;
      }

      seasonStreamerCards.push(item.details);

      if (item.inventoryItem.itemCount > 0) {
        ownedCards.push(item.details.id);
      }
    });

    setCards({
      activeCards: streamerCardsInPlay,
      seasonCards: seasonStreamerCards,
      ownedCards,
    });
  }, [channelId, fetchGame, fetchItems, gameId, seasonId, userId]);

  useEffect(() => {
    if (!channelId) {
      return;
    }

    updateCreatorCards();
  }, [channelId, updateCreatorCards]);

  useConditionalOnce(() => {
    updateCreatorCards();
  }, !!gameId && !!seasonId && !!channelId);

  useEffect(() => {
    return client.NotificationService.notifications({
      onInventoryUpdate: () => {
        updateCreatorCards();
      },
    });
  }, [client, updateCreatorCards]);

  return {
    cards,
    loading: loadingGame || loadingCardsInPlay,
    refetch: updateCreatorCards,
  };
}
