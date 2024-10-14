import { gql } from '@apollo/client';
import { useEffect } from 'react';

import { TIMED_REWARDS_PLACEMENT_ID } from '../constants';

import { useInitialRewardsQuery } from '@gen';

gql`
  query InitialRewards($placementId: ID) {
    placement(placementId: $placementId) {
      placementId
      rewards {
        readyAt
      }
    }
  }
`;

export function useInitialRewardsFetch() {
  const { data, refetch } = useInitialRewardsQuery({
    variables: { placementId: TIMED_REWARDS_PLACEMENT_ID },
  });

  useEffect(() => {
    // refetch when the first reward is ready
    const firstReadyAt = data?.placement?.rewards.find(
      (reward) => new Date(reward.readyAt).getTime() > Date.now(),
    );

    if (!firstReadyAt) {
      return;
    }

    const timeoutMs = new Date(firstReadyAt.readyAt).getTime() - Date.now();

    const timeout = setTimeout(() => {
      refetch();
    }, timeoutMs);

    return () => clearTimeout(timeout);
  }, [data?.placement?.rewards, refetch]);
}
