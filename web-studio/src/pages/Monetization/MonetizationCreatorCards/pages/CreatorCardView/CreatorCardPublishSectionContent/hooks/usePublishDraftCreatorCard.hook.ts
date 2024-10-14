import { MutationHookOptions, gql } from '@apollo/client';
import { getFieldsVariables } from '@noice-com/apollo-client-utils';

import { useStreamedGamesContext } from '../../../../context';

import {
  PublishDraftCreatorCardMutation,
  PublishDraftCreatorCardMutationVariables,
  Query,
  QueryStreamerCardDraftsArgs,
  QueryStreamerCardsArgs,
  usePublishDraftCreatorCardMutation,
} from '@gen';

gql`
  mutation PublishDraftCreatorCard($channelId: ID!, $cardId: ID!) {
    publishStreamerCardDraft(channelId: $channelId, cardId: $cardId) {
      emptyTypeWorkaround
    }
  }
`;

export function usePublishDraftCreatorCard(
  baseOptions?: Omit<
    MutationHookOptions<
      PublishDraftCreatorCardMutation,
      PublishDraftCreatorCardMutationVariables
    >,
    'update'
  >,
) {
  const { selectedGameId } = useStreamedGamesContext();

  return usePublishDraftCreatorCardMutation({
    ...baseOptions,
    update(cache, _, { variables }) {
      const cardId = variables?.cardId;

      if (!cardId) {
        return;
      }

      // Update the card's draft status to false
      cache.updateFragment(
        {
          id: cache.identify({ __typename: 'GameLogicStreamerCard', id: cardId }),
          fragment: gql`
            fragment PublishedStreamerCard on GameLogicStreamerCard {
              draft
            }
          `,
        },
        (existing) => ({ ...existing, draft: false }),
      );

      cache.modify({
        fields: {
          streamerCardDrafts(
            existing: Query['streamerCardDrafts'],
            { storeFieldName, fieldName, readField },
          ) {
            const { channelId, filters } =
              getFieldsVariables<QueryStreamerCardDraftsArgs>(storeFieldName, fieldName);

            // Ignore the cache update if the channelId or gameId don't match
            if (
              (channelId && channelId !== variables?.channelId) ||
              filters?.some((f) => f.gameId && f.gameId !== selectedGameId)
            ) {
              return existing;
            }

            // Remove the card from the draft list
            return {
              ...existing,
              cards: existing?.cards.filter(
                (cardRef) => readField('id', cardRef) !== variables.cardId,
              ),
            };
          },
          streamerCards(
            existing: Query['streamerCards'],
            { storeFieldName, fieldName, toReference },
          ) {
            const { filters } = getFieldsVariables<QueryStreamerCardsArgs>(
              storeFieldName,
              fieldName,
            );

            if (
              filters?.some(
                (f) =>
                  (f.gameId && f.gameId !== selectedGameId) ||
                  (f.channelId && f.channelId !== variables?.channelId),
              )
            ) {
              return existing;
            }

            return {
              ...existing,
              cards: [
                ...(existing?.cards ?? []),
                toReference({
                  id: cardId,
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
