import { gql } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { useEffect } from 'react';

import { UnclaimedSeasonRewardFragment, useUnclaimedSeasonRewardsQuery } from '@gen';

gql`
  fragment UnclaimedSeasonReward on RewardReward {
    id
    rewardedAt
    reason {
      reason {
        ... on ReasonReasonLevelUp {
          level
          season {
            id
            name
            cardBackgroundUrls {
              rarity
              url
            }
            game {
              id
              name
            }
          }
        }
      }
    }
    type {
      reward {
        __typename
        ... on RewardRewardTypeItem {
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
        ... on RewardRewardTypeCurrency {
          currencyId
          currencyAmount
        }
      }
    }
  }
  query UnclaimedSeasonRewards($userId: ID) {
    rewards(userId: $userId) {
      rewards {
        id
        ... on RewardReward {
          ...UnclaimedSeasonReward
        }
      }
    }
  }
`;

interface HookResult {
  unclaimedSeasonRewards: UnclaimedSeasonRewardFragment[];
  loading: boolean;
}

const getRewardsOfLatestGameWithRewards = (
  allRewards?: UnclaimedSeasonRewardFragment[],
): UnclaimedSeasonRewardFragment[] => {
  if (!allRewards) {
    return [];
  }

  const levelUpRewards = allRewards.filter(
    (reward) => reward.reason.reason?.__typename === 'ReasonReasonLevelUp',
  );

  // find latest reward
  const latestReward = levelUpRewards.reduce(
    (latest, cur) =>
      new Date(cur.rewardedAt) > new Date(latest.rewardedAt) ? cur : latest,
    levelUpRewards[0],
  );

  // rewards from the same game as the latest reward
  const rewards = levelUpRewards.filter(
    (reward) =>
      reward.reason.reason?.__typename === 'ReasonReasonLevelUp' &&
      latestReward?.reason?.reason?.__typename === 'ReasonReasonLevelUp' &&
      reward.reason.reason.season.game.id === latestReward.reason.reason.season.game.id,
  );

  return rewards;
};

export function useUnclaimedSeasonRewards(): HookResult {
  const { userId } = useAuthenticatedUser();
  const client = useClient();

  const { data, loading, refetch } = useUnclaimedSeasonRewardsQuery({
    variables: {
      userId,
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    return client.NotificationService.notifications({
      onInventoryUpdate: (_, ev) => {
        const shouldFetch = !!ev.events?.filter((event) => event.reason?.rewardClaimed)
          .length;

        if (!shouldFetch) {
          return;
        }

        refetch();
      },
      onWalletTransaction(_ctx, ev) {
        // Refetch if a reward was claimed
        if (ev.transaction?.reason?.rewardClaimed) {
          refetch();
        }
      },
    });
  }, [client, refetch]);

  return {
    unclaimedSeasonRewards:
      getRewardsOfLatestGameWithRewards(data?.rewards?.rewards) ?? [],
    loading,
  };
}
