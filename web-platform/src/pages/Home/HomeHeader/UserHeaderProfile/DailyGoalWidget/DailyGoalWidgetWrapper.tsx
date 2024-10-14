import { gql } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { usePromiseCreator } from '@noice-com/common-ui';
import { GoalCardSlotState } from '@noice-com/platform-client';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useState } from 'react';

import { DailyGoalWidget } from './DailyGoalWidget';

import { getGoalCardSlotState, isGoalCardSlotReadyForPick } from '@common/goal-card';
import { useDailyGoalWidgetGoalCardSlotsQuery } from '@gen';

gql`
  query DailyGoalWidgetGoalCardSlots {
    goalCardSlots {
      slots {
        id
        ...GoalCardSlotReadyForPickGoalCardCardSlot
        ...GoalCardSlotStateGoalCardSlot
      }
    }
  }
`;

export function DailyGoalWidgetWrapper() {
  const { data } = useDailyGoalWidgetGoalCardSlotsQuery();

  const client = useClient();

  const fetchData = useCallback(
    () => client.GoalCardService.getGlobalResetTime(),
    [client],
  );
  const [globalResetTime, getGlobalResetTime] = usePromiseCreator<Date>(fetchData);

  const [total, setTotal] = useState<Nullable<number>>(null);
  const [completed, setCompleted] = useState(0);
  const [uncollected, setUncollected] = useState(0);
  const [selected, setSelected] = useState(0);
  const [resetTime, setResetTime] = useState<Nullable<Date>>(null);

  useEffect(() => {
    getGlobalResetTime();
  }, [getGlobalResetTime]);

  useEffect(() => {
    if (!data?.goalCardSlots?.slots) {
      return;
    }

    const totalSlots = data.goalCardSlots.slots.length;
    let completedSlots = 0;
    let waitingForCollection = 0;
    let selectedSlots = 0;
    let reset: Nullable<string> = null;

    data.goalCardSlots.slots.forEach((slot) => {
      const readyForPick = isGoalCardSlotReadyForPick(slot);
      const state = getGoalCardSlotState(slot);

      if (readyForPick) {
        return;
      }

      if (!reset && slot.resetTime) {
        reset = slot.resetTime;
      }

      switch (state) {
        case GoalCardSlotState.COMPLETED:
          waitingForCollection += 1;
          completedSlots += 1;
          selectedSlots += 1;
          return;
        case GoalCardSlotState.COLLECTED:
          completedSlots += 1;
          selectedSlots += 1;
          return;
        case GoalCardSlotState.SELECTED:
          selectedSlots += 1;
          return;
      }
    });

    setTotal(totalSlots);
    setCompleted(completedSlots);
    setUncollected(waitingForCollection);
    setSelected(selectedSlots);

    if (reset !== null) {
      setResetTime(new Date(reset));
    }
  }, [data?.goalCardSlots]);

  if (total === null || globalResetTime === null) {
    return <DailyGoalWidget.Loading />;
  }

  return (
    <DailyGoalWidget
      completed={completed}
      resetTime={resetTime ?? globalResetTime}
      setGoals={selected}
      total={total}
      unclaimed={uncollected}
    />
  );
}
