import { gql } from '@apollo/client';
import { useParams } from 'react-router';

import { InventoryItemToggle } from '../../InventoryItemToggle/InventoryItemToggle';

import { PaginatedQueryTableModulePage } from '@common/page-components';
import {
  InventoryEmojisQuery,
  InventoryEmojisQueryVariables,
  useInventoryEmojisQuery,
} from '@gen';

gql`
  query InventoryEmojis($userId: ID!, $cursor: APICursorInput) {
    items(filters: [{ itemType: TYPE_EMOJI }], cursor: $cursor) {
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
export function InventoryEmojis() {
  const { userId } = useParams();

  const dataTransform = (data: InventoryEmojisQuery) => {
    return (
      data.items?.items.map((item) =>
        (({ id, name, inventoryItem }) => ({
          id: id,
          active: (
            <InventoryItemToggle
              inventoryItem={inventoryItem}
              item={item}
              toggleLabel={`Toggle ${name || id} emoji`}
            />
          ),
        }))(item),
      ) || []
    );
  };

  const getPageInfo = (data: InventoryEmojisQuery) => data.items?.pageInfo ?? null;

  return (
    <PaginatedQueryTableModulePage<InventoryEmojisQuery, InventoryEmojisQueryVariables>
      caption="User's emoji inventory"
      dataTransform={dataTransform}
      getPageInfo={getPageInfo}
      hook={useInventoryEmojisQuery}
      minifyCells={['active']}
      skip={!userId}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      variables={{ userId: userId! }}
    />
  );
}
