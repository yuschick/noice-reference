import {
  FTUEActionType,
  useAnalytics,
  useFeatureFlag,
  useTriggerFTUEAction,
} from '@noice-com/common-ui';
import { useCallback, useLayoutEffect, useState } from 'react';

import { useSoftwareRendering } from './useSoftwareRendering.hook';

import { MicroSurveyEvent, useMicroSurveys } from '@context';

interface HookResult {
  isTheaterMode: boolean;
  isSoftwareRendering: boolean;
  loading: boolean;
  toggleTheaterMode: () => void;
}

export function useTheaterMode(): HookResult {
  const [defaultStreamType, loadingFeatureFlag] = useFeatureFlag(
    'gameView_defaultStreamType',
    'arena',
  );

  const { isSoftwareRendering, loading: isSoftwareRenderingLoading } =
    useSoftwareRendering();

  const { trackEvent } = useAnalytics();
  const triggerFTUEAction = useTriggerFTUEAction();
  const { sendEvent } = useMicroSurveys();

  const [isTheaterMode, setTheaterMode] = useState(() => defaultStreamType === 'theater');

  const toggleTheaterMode = useCallback(
    () =>
      setTheaterMode((cur) => {
        if (cur) {
          trackEvent({
            clientButtonClick: {
              action: 'theater_off',
            },
          });
          return false;
        }

        trackEvent({
          clientButtonClick: {
            action: 'theater_on',
          },
        });
        triggerFTUEAction(FTUEActionType.TheaterModeEnabled);
        sendEvent(MicroSurveyEvent.UserClickedTheaterMode, {});
        return true;
      }),
    [sendEvent, trackEvent, triggerFTUEAction],
  );

  useLayoutEffect(() => {
    if (loadingFeatureFlag) {
      return;
    }

    setTheaterMode(defaultStreamType === 'theater');
  }, [defaultStreamType, loadingFeatureFlag]);

  return {
    isTheaterMode: isTheaterMode || isSoftwareRendering,
    isSoftwareRendering,
    toggleTheaterMode,
    loading: loadingFeatureFlag || isSoftwareRenderingLoading,
  };
}
