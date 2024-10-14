import { MutationHookOptions, gql } from '@apollo/client';

import {
  UpdateDraftCreatorCardMutation,
  UpdateDraftCreatorCardMutationVariables,
  useUpdateDraftCreatorCardMutation,
} from '@gen';

gql`
  mutation UpdateDraftCreatorCard(
    $cardId: ID!
    $channelId: ID!
    $gameId: ID
    $familyId: ID
    $name: String
  ) {
    updateStreamerCardDraft(
      body: {
        cardId: $cardId
        channelId: $channelId
        gameId: $gameId
        familyId: $familyId
        name: $name
      }
    ) {
      id
      name
      familyId
      gameId
      baseCard {
        id
        seasonId
      }
    }
  }
`;

export function useUpdateDraftCreatorCardDetails(
  baseOptions?: Omit<
    MutationHookOptions<
      UpdateDraftCreatorCardMutation,
      UpdateDraftCreatorCardMutationVariables
    >,
    'update' | 'variables'
  >,
) {
  return useUpdateDraftCreatorCardMutation({
    ...baseOptions,
    update(cache, { data }) {
      const newCard = data?.updateStreamerCardDraft;

      if (!newCard) {
        return;
      }

      cache.updateFragment(
        {
          id: cache.identify(newCard),
          fragment: gql`
            fragment UpdatedDraftCreatorCard on GameLogicStreamerCard {
              name
              familyId
              gameId
              baseCard(season_id: $seasonId) {
                id
              }
            }
          `,
          variables: {
            seasonId: newCard.baseCard.seasonId,
          },
        },
        (existing) => ({ ...existing, ...newCard }),
      );
    },
  });
}
