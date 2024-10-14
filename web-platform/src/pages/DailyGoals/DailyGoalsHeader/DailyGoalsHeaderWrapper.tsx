import { useClient } from '@noice-com/common-react-core';
import { usePromiseCreator } from '@noice-com/common-ui';
import { useCallback, useEffect } from 'react';

import { DailyGoalsHeader } from './DailyGoalsHeader';

export function DailyGoalsHeaderWrapper() {
  const client = useClient();

  const fetchData = useCallback(
    () => client.GoalCardService.getGlobalResetTime(),
    [client],
  );
  const [resetTime, getResetTime] = usePromiseCreator<Date>(fetchData);

  useEffect(() => {
    getResetTime();
  }, [getResetTime]);

  return (
    <DailyGoalsHeader
      countDownDate={resetTime}
      loading={!resetTime}
    />
  );
}
