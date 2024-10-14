import { MutationHookOptions, gql } from '@apollo/client';

import {
  UpdateCreatorCardSaleConfigMutation,
  UpdateCreatorCardSaleConfigMutationVariables,
  useUpdateCreatorCardSaleConfigMutation,
} from '@gen';

gql`
  mutation UpdateCreatorCardSaleConfig(
    $cardId: ID!
    $channelId: ID!
    $enabled: Boolean
    $excludeFromBundles: Boolean
  ) {
    updateStreamerCardSaleConfig(
      body: {
        excludeFromBundles: $excludeFromBundles
        cardId: $cardId
        channelId: $channelId
        enabled: $enabled
      }
    ) {
      cardId
    }
  }
`;

export function useUpdateCreatorCardSaleConfig(
  baseOptions?: Omit<
    MutationHookOptions<
      UpdateCreatorCardSaleConfigMutation,
      UpdateCreatorCardSaleConfigMutationVariables
    >,
    'update' | 'variables' | 'errorPolicy'
  >,
) {
  return useUpdateCreatorCardSaleConfigMutation({
    ...baseOptions,
    update(cache, result, options) {
      const cardId = result.data?.updateStreamerCardSaleConfig?.cardId;

      if (!cardId) {
        return;
      }

      cache.updateFragment(
        {
          id: cache.identify({ id: cardId, __typename: 'GameLogicStreamerCard' }),
          fragment: gql`
            fragment UpdatedCreatorCardSaleConfig on GameLogicStreamerCard {
              saleConfig {
                cardId
                enabled
                excludeFromBundles
              }
            }
          `,
        },
        (existing) => ({
          ...existing,
          saleConfig: {
            ...existing.saleConfig,
            cardId,
            excludeFromBundles:
              options.variables?.excludeFromBundles ??
              existing.saleConfig.excludeFromBundles,
            enabled: options.variables?.enabled ?? existing.saleConfig.enabled,
          },
        }),
      );
    },
  });
}
