import { MutationHookOptions, gql } from '@apollo/client';

import {
  DeleteDraftCardMutation,
  DeleteDraftCardMutationVariables,
  useDeleteDraftCardMutation,
} from '@gen';

gql`
  mutation DeleteDraftCard($cardId: ID!, $channelId: ID!) {
    deleteStreamerCardDraft(cardId: $cardId, channelId: $channelId) {
      emptyTypeWorkaround
    }
  }
`;

export function useDeleteDraftCard(
  baseOptions?: Omit<
    MutationHookOptions<DeleteDraftCardMutation, DeleteDraftCardMutationVariables>,
    'update' | 'variables'
  >,
) {
  return useDeleteDraftCardMutation({
    ...baseOptions,
    update(cache, _, { variables }) {
      if (!variables?.cardId) {
        return;
      }

      cache.evict({
        id: cache.identify({
          id: variables.cardId,
          __typename: 'GameLogicStreamerCard',
        }),
      });

      cache.gc();
    },
  });
}
