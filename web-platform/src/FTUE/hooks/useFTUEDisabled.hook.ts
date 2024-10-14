import { CommonUtils, useBooleanFeatureFlag, useMediaQuery } from '@noice-com/common-ui';
import { useStreamAPI } from '@noice-com/stream';
import { useEffect, useState } from 'react';

import { useListenToUIEvent, AppUIEventType } from '@common/ui-event';

export function useFTUEDisabled() {
  const [streamLoading, setStreamLoading] = useState<boolean>(false);
  const [DGCPromptOpen, setDGCPromptOpen] = useState(false);
  const isSmallScreen = useMediaQuery(`(max-width: ${CommonUtils.getRem(459)})`);

  const [showFTUE] = useBooleanFeatureFlag('showFTUE', true);
  const [startedCardsDialogOpen, setStarterCardDialogOpen] = useState(false);
  const { events } = useStreamAPI();

  useListenToUIEvent(AppUIEventType.StartingCardsDialogOpen, setStarterCardDialogOpen);
  useListenToUIEvent(AppUIEventType.DGCPromptOpen, setDGCPromptOpen);

  useEffect(() => {
    events.addListener('onStreamLoading', setStreamLoading);

    return () => {
      events.removeListener('onStreamLoading', setStreamLoading);
    };
  }, [events, setStreamLoading]);

  return (
    isSmallScreen || !showFTUE || streamLoading || startedCardsDialogOpen || DGCPromptOpen
  );
}
