import { MutationHookOptions, MutationTuple, gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';

import {
  CreateCreatorCardDraftMutation,
  CreateCreatorCardDraftMutationVariables,
  CreatorCardViewCreatorCardWithBaseCardFragmentDoc,
  useCreateCreatorCardDraftMutation,
} from '@gen';

gql`
  mutation CreateCreatorCardDraft(
    $channelId: ID!
    $familyId: ID
    $name: String
    $gameId: ID
  ) {
    createStreamerCardDraft(
      channelId: $channelId
      familyId: $familyId
      name: $name
      gameId: $gameId
    ) {
      id
      ...CreatorCardViewCreatorCard
    }
  }

  fragment CreatorCardViewCreatorCardWithBaseCard on GameLogicStreamerCard {
    ...CreatorCardViewCreatorCard
    baseCard {
      id
    }
  }
`;

export function useCreateCreatorCardDraft(
  baseCardId: Nullable<string>,
  baseOptions?: Omit<
    MutationHookOptions<
      CreateCreatorCardDraftMutation,
      CreateCreatorCardDraftMutationVariables
    >,
    'update' | 'variables'
  >,
): MutationTuple<
  CreateCreatorCardDraftMutation,
  CreateCreatorCardDraftMutationVariables
> {
  return useCreateCreatorCardDraftMutation({
    ...baseOptions,
    update: (cache, { data }, { variables }) => {
      const card = data?.createStreamerCardDraft;
      const { channelId, gameId } = variables ?? {};

      if (!card || !channelId || !gameId) {
        return;
      }

      cache.writeFragment({
        id: cache.identify(card),
        data: {
          ...card,
          baseCard: {
            __typename: 'GameLogicCard',
            id: baseCardId,
          },
        },
        fragmentName: 'CreatorCardViewCreatorCardWithBaseCard',
        fragment: CreatorCardViewCreatorCardWithBaseCardFragmentDoc,
      });

      // Add card to the draft list
      cache.modify({
        fields: {
          streamerCardDrafts(existing, { storeFieldName, toReference }) {
            if (!storeFieldName.includes(channelId) || !storeFieldName.includes(gameId)) {
              return existing;
            }

            return {
              ...existing,
              cards: [
                ...existing.cards,
                toReference({
                  id: card.id,
                  __typename: 'GameLogicStreamerCard',
                }),
              ],
            };
          },
        },
      });
    },
  });
}
