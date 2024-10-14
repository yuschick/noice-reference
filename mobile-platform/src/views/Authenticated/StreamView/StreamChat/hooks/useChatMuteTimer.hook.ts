import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { useChatContext } from '@providers/ChatProvider';

const getTimestamp = (duration: number) => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + duration);
  return time;
};

type HookResult = [muteStartTime: Nullable<Date>, reset: () => void];

export function useChatMuteTimer(): HookResult {
  const { muteState } = useChatContext();
  const [muteStartTime, setMuteStartTime] = useState<Nullable<Date>>(null);

  useEffect(() => {
    if (!muteState?.muted || !muteState?.duration) {
      setMuteStartTime(null);
      return;
    }

    const secondsFromStart = Math.abs((Date.now() - (muteState?.startTime ?? 0)) / 1000);
    const timeStamp = getTimestamp(muteState.duration - secondsFromStart);

    // If timestamp is in the past, do nothing
    if (timeStamp.getTime() <= Date.now()) {
      setMuteStartTime(null);
      return;
    }

    setMuteStartTime(timeStamp);
  }, [muteState]);

  const reset = () => {
    setMuteStartTime(null);
  };

  return [muteStartTime, reset];
}
