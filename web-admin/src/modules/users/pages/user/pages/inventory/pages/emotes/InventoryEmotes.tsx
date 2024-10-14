import { gql } from '@apollo/client';
import { useParams } from 'react-router';

import { InventoryItemToggle } from '../../InventoryItemToggle/InventoryItemToggle';

import { PaginatedQueryTableModulePage } from '@common/page-components';
import {
  InventoryEmotesQuery,
  InventoryEmotesQueryVariables,
  useInventoryEmotesQuery,
} from '@gen';

gql`
  query InventoryEmotes($userId: ID!, $cursor: APICursorInput) {
    items(filters: [{ itemType: TYPE_EMOTE }], cursor: $cursor) {
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
      items {
        id
        name
        inventoryItem(user_id: $userId) {
          ...InventoryItemToggleInventoryItem
        }
        ...InventoryItemToggleItem
      }
    }
  }
`;

export function InventoryEmotes() {
  const { userId } = useParams();

  const dataTransform = (data: InventoryEmotesQuery) => {
    return (
      data.items?.items.map((item) =>
        (({ id, name, inventoryItem }) => ({
          id: id,
          active: (
            <InventoryItemToggle
              inventoryItem={inventoryItem}
              item={item}
              toggleLabel={`Toggle ${name || id} emote`}
            />
          ),
        }))(item),
      ) || []
    );
  };

  const getPageInfo = (data: InventoryEmotesQuery) => data.items?.pageInfo ?? null;

  return (
    <PaginatedQueryTableModulePage<InventoryEmotesQuery, InventoryEmotesQueryVariables>
      caption="User's emote inventory"
      dataTransform={dataTransform}
      getPageInfo={getPageInfo}
      hook={useInventoryEmotesQuery}
      minifyCells={['active']}
      skip={!userId}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      variables={{ userId: userId! }}
    />
  );
}
