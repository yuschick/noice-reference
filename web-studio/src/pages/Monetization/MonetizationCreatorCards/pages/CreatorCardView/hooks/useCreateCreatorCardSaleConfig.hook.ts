import { MutationHookOptions, gql } from '@apollo/client';

import {
  CreateCreatorCardSaleConfigMutation,
  CreateCreatorCardSaleConfigMutationVariables,
  useCreateCreatorCardSaleConfigMutation,
} from '@gen';

gql`
  mutation CreateCreatorCardSaleConfig(
    $cardId: ID!
    $channelId: ID!
    $enabled: Boolean!
    $excludeFromBundles: Boolean
  ) {
    createStreamerCardSaleConfig(
      excludeFromBundles: $excludeFromBundles
      cardId: $cardId
      channelId: $channelId
      enabled: $enabled
    ) {
      cardId
    }
  }
`;

export function useCreateCreatorCardSaleConfig(
  baseOptions?: Omit<
    MutationHookOptions<
      CreateCreatorCardSaleConfigMutation,
      CreateCreatorCardSaleConfigMutationVariables
    >,
    'update' | 'variables'
  >,
) {
  return useCreateCreatorCardSaleConfigMutation({
    ...baseOptions,
    update(cache, result, options) {
      const cardId = result.data?.createStreamerCardSaleConfig?.cardId;

      if (!cardId) {
        return;
      }

      cache.updateFragment(
        {
          id: cache.identify({ id: cardId, __typename: 'GameLogicStreamerCard' }),
          fragment: gql`
            fragment CreatedCreatorCardSaleConfig on GameLogicStreamerCard {
              saleConfig {
                cardId
                channelId
                enabled
                excludeFromBundles
              }
            }
          `,
        },
        (existing) => ({
          ...existing,
          saleConfig: {
            cardId,
            channelId: options.variables?.channelId,
            excludeFromBundles: options.variables?.excludeFromBundles,
            enabled: options.variables?.enabled,
          },
        }),
      );
    },
  });
}
