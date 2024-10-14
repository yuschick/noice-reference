import { gql } from '@apollo/client';
import { GoalCardSlotState } from '@noice-com/platform-client';
import { useState } from 'react';

import { getGoalCardSlotState, isGoalCardSlotResetTimePast } from '@common/goal-card';
import {
  useUseDailyGoalsTooltipDataQuery,
  UseDailyGoalsTooltipDataSlotFragment,
} from '@gen';

gql`
  query UseDailyGoalsTooltipData {
    goalCardSlots {
      slots {
        ...UseDailyGoalsTooltipDataSlot
      }
    }
  }

  fragment UseDailyGoalsTooltipDataSlot on GoalCardGoalCardSlot {
    id
    reward {
      id
    }
    resetTime
    progress {
      completed
    }
    ...DailyGoalTooltipContentGoalCardSlot
    ...GoalCardSlotStateGoalCardSlot
    ...GoalCardSlotResetTimePastGoalCardSlot
  }
`;

export function useDailyGoalsTooltipData() {
  const [slots, setSlots] = useState<UseDailyGoalsTooltipDataSlotFragment[]>([]);

  const [amountCompletedGoals, setAmountCompletedGoals] = useState<number>(0);

  const { loading, error } = useUseDailyGoalsTooltipDataQuery({
    onCompleted: (data) => {
      setSlots(data.goalCardSlots?.slots ?? []);
      setAmountCompletedGoals(
        data.goalCardSlots?.slots.filter((slot) => {
          const state = getGoalCardSlotState(slot);
          const resetTimePast = isGoalCardSlotResetTimePast(slot);

          return (
            state === GoalCardSlotState.COMPLETED ||
            (state === GoalCardSlotState.COLLECTED && !resetTimePast)
          );
        }).length ?? 0,
      );
    },
  });

  return { slots, amountCompletedGoals, loading, error };
}
