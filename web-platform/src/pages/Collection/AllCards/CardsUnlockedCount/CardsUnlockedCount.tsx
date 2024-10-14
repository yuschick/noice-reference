import { gql } from '@apollo/client';
import { LoadingSkeleton, useAuthenticatedUser } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useState } from 'react';

import styles from './CardsUnlockedCount.module.css';

import {
  ItemItemType,
  useCollectionCardsUnlockedCountCardsLazyQuery,
  useCollectionCardsUnlockedCountProfileQuery,
} from '@gen';

gql`
  query CollectionCardsUnlockedCountProfile($userId: ID, $seasonId: ID) {
    seasonProgression(userId: $userId, seasonId: $seasonId) {
      seasonId
      level
    }
  }

  query CollectionCardsUnlockedCountCards(
    $userId: ID
    $inventoryFilters: [InventoryListUserInventoryRequestFilterInput!]
    $seasonId: ID
    $minLevel: Int!
  ) {
    inventory(userId: $userId, filters: $inventoryFilters) {
      items {
        itemId
        itemCount
        item {
          id
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
                  __typename
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

interface Props {
  className?: string;
  gameId: Nullable<string>;
  seasonId: Nullable<string>;
}

export function CardsUnlockedCount({ className, gameId, seasonId }: Props) {
  const { userId } = useAuthenticatedUser();
  const [amounts, setAmounts] =
    useState<Nullable<{ unlocked: number; total: number }>>(null);

  const [fetchCards, { loading: loadingCards }] =
    useCollectionCardsUnlockedCountCardsLazyQuery();

  const { loading: profileLoading } = useCollectionCardsUnlockedCountProfileQuery({
    variables: { userId, seasonId },
    skip: !seasonId || !gameId,
    fetchPolicy: 'cache-and-network',
    onCompleted: async (profileData) => {
      const { data: cardsData } = await fetchCards({
        variables: {
          inventoryFilters: [
            { gameId },
            { itemType: ItemItemType.TypeGameCard },
            { seasonId },
          ],
          userId,
          seasonId,
          minLevel: (profileData?.seasonProgression?.level ?? 0) + 1,
        },
        fetchPolicy: 'cache-and-network',
      });

      const unlockedCardsCount = cardsData?.inventory?.items.length ?? 0;
      const uncollectedCardsCount = (cardsData?.rewards?.rewards ?? [])?.filter(
        (reward) => {
          if (reward.type.reward?.__typename !== 'RewardRewardTypeItem') {
            return false;
          }

          if (reward.type.reward.item.details?.__typename !== 'GameLogicCard') {
            return false;
          }

          if (
            reward.type.reward.item.gameId !== gameId ||
            reward.type.reward.item.seasonId !== seasonId
          ) {
            return false;
          }

          return !!reward;
        },
      ).length;
      const lockedCardsCount = (cardsData?.listLevelConfigs?.levelConfigs ?? []).filter(
        (config) => {
          const reward = config.rewards.find(({ reward }) => {
            if (reward?.__typename !== 'RewardRewardTypeItem') {
              return;
            }

            return reward.item.details?.__typename === 'GameLogicCard';
          });

          return !!reward;
        },
      ).length;

      setAmounts({
        unlocked: unlockedCardsCount,
        total: unlockedCardsCount + lockedCardsCount + uncollectedCardsCount,
      });
    },
  });

  if (profileLoading || loadingCards) {
    return (
      <LoadingSkeleton
        height={32}
        width={260}
      />
    );
  }

  return (
    <div className={classNames(styles.wrapper, className)}>
      <span className={styles.textCount}>
        {amounts?.unlocked ?? 0}/{amounts?.total ?? 0}
      </span>
      <span className={styles.textDescription}>cards unlocked</span>
    </div>
  );
}
