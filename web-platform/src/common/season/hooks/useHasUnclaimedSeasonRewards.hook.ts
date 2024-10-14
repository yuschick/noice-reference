import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useClient } from '@noice-com/common-react-core';
import { useAuthentication } from '@noice-com/common-ui';
import { useEffect, useMemo } from 'react';

import { useHasUnclaimedSeasonRewardsQuery } from '@gen';

gql`
  query HasUnclaimedSeasonRewards($userId: ID!) {
    rewards(userId: $userId) {
      rewards {
        id
        rewardedAt
        reason {
          reason {
            ... on ReasonReasonLevelUp {
              season {
                id
                game {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

interface GameIdAndSeasonId {
  gameId: string;
  seasonId: string;
}

interface HookResult {
  hasUnclaimedSeasonRewards: boolean;
  gamesWithSeasonRewards: GameIdAndSeasonId[];
  loading: boolean;
}

export function useHasUnclaimedSeasonRewards(): HookResult {
  const { userId } = useAuthentication();
  const client = useClient();

  const { data, loading, refetch } = useHasUnclaimedSeasonRewardsQuery({
    ...variablesOrSkip({ userId }),
  });

  useEffect(() => {
    // Skip if no user id
    if (!userId) {
      return;
    }

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
  }, [client, refetch, userId]);

  const gamesWithSeasonRewards: GameIdAndSeasonId[] = useMemo(
    () =>
      (data?.rewards?.rewards
        .map((reward) => {
          if (reward.reason.reason?.__typename !== 'ReasonReasonLevelUp') {
            return null;
          }

          if (!reward.reason.reason.season.game.id) {
            return null;
          }

          return {
            gameId: reward.reason.reason.season.game.id,
            seasonId: reward.reason.reason.season.id,
          };
        })
        .filter(Boolean) as GameIdAndSeasonId[]) ?? [],
    [data?.rewards?.rewards],
  );

  return {
    hasUnclaimedSeasonRewards: !!gamesWithSeasonRewards.length,
    gamesWithSeasonRewards,
    loading,
  };
}
