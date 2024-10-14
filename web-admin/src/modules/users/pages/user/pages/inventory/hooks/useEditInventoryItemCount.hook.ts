import { ApolloCache, ApolloError, gql } from '@apollo/client';

import { showSnackbar } from '@common/snackbar';
import {
  DecreaseInventoryItemCountMutationVariables,
  EditedInventoryItemFragment,
  IncreaseInventoryItemCountMutationVariables,
  useDecreaseInventoryItemCountMutation,
  useIncreaseInventoryItemCountMutation,
} from '@gen';

gql`
  mutation IncreaseInventoryItemCount(
    $userId: ID!
    $itemId: ID!
    $itemCount: Int!
    $reason: ReasonReasonInput!
  ) {
    addUserEntitlements(
      userId: $userId
      entitlements: [{ itemId: $itemId, itemCount: $itemCount }]
      reason: $reason
    ) {
      items {
        itemCount
        itemId
      }
    }
  }

  mutation DecreaseInventoryItemCount(
    $userId: ID!
    $itemId: ID!
    $itemCount: Int!
    $reason: ReasonReasonInput!
  ) {
    consumeUserItem(
      userId: $userId
      reason: $reason
      consumptions: [{ itemId: $itemId, itemCount: $itemCount }]
    ) {
      items {
        itemCount
        itemId
      }
    }
  }
`;

const getCacheId = (cache: ApolloCache<unknown>, item: EditedInventoryItemFragment) => {
  if (!item.details) {
    return cache.identify(item);
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  return cache.identify({ ...item, details: { __ref: cache.identify(item.details) } });
};

export function useEditInventoryItemCount(item: EditedInventoryItemFragment) {
  const update = (
    cache: ApolloCache<unknown>,
    variables:
      | IncreaseInventoryItemCountMutationVariables
      | DecreaseInventoryItemCountMutationVariables,
    resultItemCount?: number,
  ) => {
    cache.updateFragment(
      {
        id: getCacheId(cache, item),
        fragment: gql`
          fragment EditedInventoryItem on ItemItem {
            id
            name
            inventoryItem(user_id: $userId) {
              itemCount
            }
            details {
              ... on GameLogicCard {
                id
              }
              ... on GameLogicStreamerCard {
                id
              }
              ... on AvatarAnimation {
                id
              }
              ... on EmojiEmoji {
                id
              }
            }
          }
        `,
        variables: { userId: variables.userId },
      },
      (existing) => ({
        ...existing,
        inventoryItem: {
          ...existing.inventoryItem,
          itemCount: resultItemCount ?? existing.inventoryItem?.itemCount,
        },
      }),
    );
  };

  const onCompleted = () => {
    showSnackbar('positive', 'Inventory updated successfully');
  };

  const onError = (error: ApolloError) => {
    showSnackbar('error', `An error occurred while updating inventory: ${error.message}`);
  };

  const [increaseItemAmount, { loading: loadingIncrease }] =
    useIncreaseInventoryItemCountMutation({
      update(cache, result, { variables }) {
        if (!variables) {
          return;
        }

        update(cache, variables, result.data?.addUserEntitlements?.items?.[0]?.itemCount);
      },
      onCompleted,
      onError,
    });

  const [decreaseItemAmount, { loading: loadingDecrease }] =
    useDecreaseInventoryItemCountMutation({
      update(cache, result, { variables }) {
        if (!variables) {
          return;
        }

        update(cache, variables, result.data?.consumeUserItem?.items?.[0]?.itemCount);
      },
      onCompleted,
      onError,
    });

  const editInventoryItemCount = (
    variables:
      | IncreaseInventoryItemCountMutationVariables
      | DecreaseInventoryItemCountMutationVariables,
  ) => {
    if (variables.itemCount > 0) {
      increaseItemAmount({ variables });
      return;
    }

    decreaseItemAmount({
      variables: {
        ...variables,
        itemCount: -1 * variables.itemCount,
      },
    });
  };

  return { editInventoryItemCount, loading: loadingDecrease || loadingIncrease };
}
