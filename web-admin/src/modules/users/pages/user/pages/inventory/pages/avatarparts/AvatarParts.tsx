import { gql } from '@apollo/client';
import { useParams } from 'react-router';

import { InventoryItemToggle } from '../../InventoryItemToggle/InventoryItemToggle';

import { PaginatedQueryTableModulePage } from '@common/page-components';
import {
  InventoryAvatarPartsQuery,
  InventoryAvatarPartsQueryVariables,
  useInventoryAvatarPartsQuery,
} from '@gen';

gql`
  query InventoryAvatarParts($userId: ID!, $cursor: APICursorInput) {
    items(filters: [{ itemType: TYPE_AVATAR_ITEM }], cursor: $cursor) {
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

export function InventoryAvatarParts() {
  const { userId } = useParams();

  const dataTransform = (data: InventoryAvatarPartsQuery) => {
    return (
      data.items?.items.map((item) =>
        (({ id, name, inventoryItem }) => ({
          id: id,
          active: (
            <InventoryItemToggle
              inventoryItem={inventoryItem}
              item={item}
              toggleLabel={`Toggle ${name || id} avatar part`}
            />
          ),
        }))(item),
      ) || []
    );
  };

  const getPageInfo = (data: InventoryAvatarPartsQuery) => data.items?.pageInfo ?? null;

  return (
    <PaginatedQueryTableModulePage<
      InventoryAvatarPartsQuery,
      InventoryAvatarPartsQueryVariables
    >
      caption="User's emote inventory"
      dataTransform={dataTransform}
      getPageInfo={getPageInfo}
      hook={useInventoryAvatarPartsQuery}
      minifyCells={['active']}
      skip={!userId}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      variables={{ userId: userId! }}
    />
  );
}
