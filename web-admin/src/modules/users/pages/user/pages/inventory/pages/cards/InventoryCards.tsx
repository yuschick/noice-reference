import { gql } from '@apollo/client';

import { useCardFilters } from './hooks/useCardFilters.hook';
import { InventoryCardsEditPopover } from './InventoryCardsEditPopover';

import { PaginatedQueryTableModulePage } from '@common/page-components';
import {
  InventoryCardsQuery,
  InventoryCardsQueryVariables,
  useInventoryCardsQuery,
} from '@gen';

gql`
  query InventoryCards(
    $userId: ID!
    $filters: [ItemListItemsRequestFilterInput!]
    $cursor: APICursorInput
  ) {
    items(filters: $filters, cursor: $cursor) {
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
      items {
        id
        name
        type
        game {
          id
          name
        }
        season {
          id
          name
        }
        name
        details {
          ... on GameLogicCard {
            id
            name
            leveling {
              currentLevel
            }
          }
          ... on GameLogicStreamerCard {
            baseCard {
              id
              name
              leveling {
                currentLevel
              }
            }
          }
        }
        inventoryItem(user_id: $userId) {
          ...InventoryCardsEditPopoverInventoryItem
        }
        ...InventoryCardsEditPopoverItem
      }
    }
  }
`;

export function InventoryCards() {
  const { skip, variables } = useCardFilters();

  const dataTransform = (data: InventoryCardsQuery) => {
    return (
      data.items?.items.map((item) =>
        ((item) => {
          const { inventoryItem } = item;
          const { id: itemId } = item;

          let name = '';
          let level: number | undefined = undefined;
          let type = '';

          if (item.details?.__typename === 'GameLogicCard') {
            name = item.details.name;
            level = item.details.leveling.currentLevel;
            type = 'Card';
          }

          if (item.details?.__typename === 'GameLogicStreamerCard') {
            name = item.details.baseCard.name;
            level = item.details.baseCard.leveling.currentLevel;
            type = 'Streamer card';
          }

          return {
            id: itemId,
            name,
            type,
            game: item.game?.name,
            season: item.season?.name,
            level,
            itemCount: inventoryItem.itemCount,
            action: (
              <InventoryCardsEditPopover
                activeCardToEdit={inventoryItem}
                item={item}
              />
            ),
          };
        })(item),
      ) || []
    );
  };

  const getPageInfo = (data: InventoryCardsQuery) => data.items?.pageInfo ?? null;

  return (
    <>
      <PaginatedQueryTableModulePage<InventoryCardsQuery, InventoryCardsQueryVariables>
        caption="User's card inventory"
        dataTransform={dataTransform}
        getPageInfo={getPageInfo}
        hiddenHeaders={['action']}
        hook={useInventoryCardsQuery}
        skip={skip}
        variables={variables}
      />
    </>
  );
}
