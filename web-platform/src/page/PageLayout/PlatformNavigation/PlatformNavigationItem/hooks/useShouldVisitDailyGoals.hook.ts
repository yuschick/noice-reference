import { gql } from '@apollo/client';
import { useAuthentication } from '@noice-com/common-ui';
import { GoalCardSlotState } from '@noice-com/platform-client';
import { useMemo } from 'react';

import { getGoalCardSlotState, isGoalCardSlotResetTimePast } from '@common/goal-card';
import { useUseShouldVisitDailyGoalsGoalCardSlotsQuery } from '@gen';

gql`
  query UseShouldVisitDailyGoalsGoalCardSlots {
    goalCardSlots {
      slots {
        id
        ...GoalCardSlotStateGoalCardSlot
        ...GoalCardSlotResetTimePastGoalCardSlot
      }
    }
  }
`;

export function useShouldVisitDailyGoals() {
  const { userId } = useAuthentication();
  const { data } = useUseShouldVisitDailyGoalsGoalCardSlotsQuery({ skip: !userId });

  const shouldVisitDailyGoals = useMemo(() => {
    const slotsNeedingAction = data?.goalCardSlots?.slots?.filter((slot) => {
      const state = getGoalCardSlotState(slot);
      const resetTimePast = isGoalCardSlotResetTimePast(slot);

      if (
        state === GoalCardSlotState.EMPTY ||
        state === GoalCardSlotState.FAILED ||
        state === GoalCardSlotState.COMPLETED ||
        (state === GoalCardSlotState.COLLECTED && resetTimePast)
      ) {
        return true;
      }

      return false;
    });

    return !!slotsNeedingAction?.length;
  }, [data]);

  return shouldVisitDailyGoals;
}
