import { usePreviousValue } from '@noice-com/common-ui';
import { ContentMode } from '@noice-com/schemas/rendering/transitions.pb';
import { StreamProp, useStreamAPI } from '@noice-com/stream';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

interface HookResult {
  isSpotlightShowing: boolean;
  isMatchEndShowing: boolean;
  contentMode: Nullable<ContentMode>;
}

export function useContentModeStates(): HookResult {
  const [contentMode, setContentMode] = useState<Nullable<ContentMode>>(null);
  const previousContentMode = usePreviousValue(contentMode);

  const { events } = useStreamAPI();

  const isSpotlightShowing =
    !!contentMode?.groupSpotlight || !!contentMode?.userSpotlight;
  const isMatchEndShowing =
    !!contentMode?.matchEnd ||
    (!!previousContentMode?.matchEnd && !!contentMode?.cameraDrive);

  useEffect(() => {
    const contentModeCallback = (contentMode: StreamProp<ContentMode>) => {
      setContentMode(contentMode.value);
    };

    events.addListener('onContentMode', contentModeCallback);

    return () => {
      events.removeListener('onContentMode', contentModeCallback);
    };
  }, [events]);

  return {
    contentMode,
    isSpotlightShowing,
    isMatchEndShowing,
  };
}
