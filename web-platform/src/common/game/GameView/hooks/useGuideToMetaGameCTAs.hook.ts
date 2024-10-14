import { gql } from '@apollo/client';
import { GoalCardSlotState } from '@noice-com/platform-client';

import { getGoalCardSlotState, isGoalCardSlotReadyForPick } from '@common/goal-card';
import { TIMED_REWARDS_PLACEMENT_ID, filterAvailableRewards } from '@common/placement';
import { useStoreHasBundlesToBuy } from '@common/store-bundle';
import { useGuideToMetaGameDataQuery } from '@gen';

gql`
  query GuideToMetaGameData($placementId: ID!) {
    placement(placementId: $placementId) {
      placementId
      rewards {
        ...AvailableRewardsReward
      }
    }

    goalCardSlots {
      slots {
        id
        ...GoalCardSlotStateGoalCardSlot
        ...GoalCardSlotReadyForPickGoalCardCardSlot
        ...GoalCardSlotReadyForPickGoalCardCardSlot
      }
    }
  }
`;

interface HookResult {
  hasAvailableCTAs: boolean;
  hasCompletedDailyGoals: boolean;
  hasAvailableActionsInDailyGoals: boolean;
  adRewardAmount: number;
  canBuyPremiumBundles: boolean;
  canBuyStandardBundles: boolean;
}

export function useGuideToMetaGameCTAs(): HookResult {
  const {
    canBuyPremiumBundles,
    canBuyStandardBundles,
    loading: loadingBundles,
  } = useStoreHasBundlesToBuy();

  const { data, loading: loadingData } = useGuideToMetaGameDataQuery({
    variables: { placementId: TIMED_REWARDS_PLACEMENT_ID },
  });

  const adRewardAmount = filterAvailableRewards(data?.placement?.rewards ?? []).length;

  const hasCompletedDailyGoals =
    data?.goalCardSlots?.slots?.some(
      (slot) => getGoalCardSlotState(slot) === GoalCardSlotState.COMPLETED,
    ) ?? false;

  const hasAvailableActionsInDailyGoals =
    data?.goalCardSlots?.slots?.some((slot) => isGoalCardSlotReadyForPick(slot)) ?? false;

  const loading = loadingBundles || loadingData;

  const hasAvailableCTAs =
    !loading &&
    (hasCompletedDailyGoals ||
      adRewardAmount > 0 ||
      canBuyPremiumBundles ||
      canBuyStandardBundles);

  return {
    hasAvailableCTAs,
    hasCompletedDailyGoals,
    hasAvailableActionsInDailyGoals,
    adRewardAmount,
    canBuyPremiumBundles,
    canBuyStandardBundles,
  };
}
