import { gql } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import {
  ItemItemType,
  UseBaseCardsGameCardFragment,
  useUseBaseCardsLazyQuery,
  useUseBaseCardsSeasonProgressionQuery,
} from '@gen';

gql`
  fragment UseBaseCardsGameCard on GameLogicCard {
    id
    seasonId
    ...CardGridGameCard
    ...CardDetailLevelCardLeveling
    ...CollectionItemModalBaseCard
  }

  query UseBaseCardsSeasonProgression($userId: ID, $seasonId: ID) {
    seasonProgression(userId: $userId, seasonId: $seasonId) {
      seasonId
      level
    }
  }

  query UseBaseCards(
    $seasonId: ID
    $minLevel: Int!
    $userId: ID!
    $inventoryFilters: [InventoryListUserInventoryRequestFilterInput!]
  ) {
    inventory(userId: $userId, filters: $inventoryFilters) {
      items {
        itemId
        item {
          id
          details {
            ... on GameLogicCard {
              ...UseBaseCardsGameCard
            }
          }
        }
      }
    }

    listLevelConfigs(minLevel: $minLevel, seasonId: $seasonId) {
      levelConfigs {
        number
        rewards {
          reward {
            ... on RewardRewardTypeItem {
              itemId
              item {
                id
                details {
                  ... on GameLogicCard {
                    ...UseBaseCardsGameCard
                  }
                }
              }
            }
          }
        }
      }
    }

    rewards(userId: $userId) {
      rewards {
        type {
          reward {
            ... on RewardRewardTypeItem {
              itemId
              item {
                gameId
                seasonId
                details {
                  ... on GameLogicCard {
                    ...UseBaseCardsGameCard
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

interface LockedCard {
  card: UseBaseCardsGameCardFragment;
  requiredLevel: number;
}

interface Cards {
  unlockedCards: UseBaseCardsGameCardFragment[];
  uncollectedCards: UseBaseCardsGameCardFragment[];
  lockedCards: LockedCard[];
}

interface Props {
  gameId: Nullable<string>;
  seasonId: Nullable<string>;
}

interface HookResult {
  cards: Cards;
  loading: boolean;
}

export function useBaseCards({ gameId, seasonId }: Props): HookResult {
  const { userId } = useAuthenticatedUser();
  const client = useClient();
  const [cards, setCards] = useState<Cards>({
    lockedCards: [],
    uncollectedCards: [],
    unlockedCards: [],
  });

  const [fetchCards, { loading: cardsDataLoading }] = useUseBaseCardsLazyQuery();

  const { loading: progressionDataLoading, refetch } =
    useUseBaseCardsSeasonProgressionQuery({
      variables: { userId, seasonId },
      fetchPolicy: 'cache-and-network',
      onCompleted: async (seasonProgressionData) => {
        const { data: cardsData } = await fetchCards({
          variables: {
            seasonId,
            minLevel: (seasonProgressionData?.seasonProgression?.level ?? 0) + 1,
            userId,
            inventoryFilters: [
              { gameId },
              { itemType: ItemItemType.TypeGameCard },
              { seasonId },
            ],
          },
          fetchPolicy: 'cache-and-network',
        });

        const lockedCards = (cardsData?.listLevelConfigs?.levelConfigs ?? [])
          .map((config) => {
            // Get first reward that is a game card and object not empty
            const reward = config.rewards.find(({ reward }) => {
              if (reward?.__typename !== 'RewardRewardTypeItem') {
                return;
              }

              return Object.keys(reward.item).length > 0;
            });

            // if no reward or wrong kind, return null
            if (!reward?.reward) {
              return null;
            }

            if (reward?.reward.__typename !== 'RewardRewardTypeItem') {
              return null;
            }

            return {
              requiredLevel: config.number,
              card: reward.reward.item.details,
            };
          })
          .filter(Boolean) as LockedCard[];

        const uncollectedCards = (cardsData?.rewards?.rewards ?? [])
          .map((reward) => {
            if (reward.type.reward?.__typename !== 'RewardRewardTypeItem') {
              return null;
            }

            if (reward.type.reward.item.details?.__typename !== 'GameLogicCard') {
              return null;
            }

            if (
              reward.type.reward.item.gameId !== gameId ||
              reward.type.reward.item.seasonId !== seasonId
            ) {
              return null;
            }

            return reward.type.reward.item.details;
          })
          .filter(Boolean) as UseBaseCardsGameCardFragment[];

        setCards({
          unlockedCards: (cardsData?.inventory?.items.map((item) => item.item.details) ??
            []) as UseBaseCardsGameCardFragment[],
          uncollectedCards,
          lockedCards,
        });
      },
      skip: !gameId || !seasonId,
    });

  useEffect(() => {
    return client.NotificationService.notifications({
      onInventoryUpdate: () => {
        refetch();
      },
    });
  }, [client, refetch]);

  return { cards, loading: cardsDataLoading || progressionDataLoading };
}
