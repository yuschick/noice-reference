import { useMountEffect } from '@noice-com/common-react-core';
import {
  SetTimeoutId,
  useBooleanFeatureFlag,
  useConversionEvents,
} from '@noice-com/common-ui';
import { makeLoggers, Nullable } from '@noice-com/utils';
import { useCallback, useState, useRef } from 'react';

import {
  AD_DISMISSED_EVENT_NAME,
  AD_INTERRUPTED_EVENT_NAME,
  AD_VIEWED_EVENT_NAME,
} from '@common/placement/constants';

const { logInfo } = makeLoggers('useGoogleH5Ads');

// we use events instead of callbacks in the hook because callbacks are bound to a component instance where they were created,
// but the cached ad has to be accessible for different instances of the same component.
// See adBreak() call below, it forces us to define its callbacks before we receive an ad.
const adDismissedEvent = new Event(AD_DISMISSED_EVENT_NAME);
const adViewedEvent = new Event(AD_VIEWED_EVENT_NAME);
const adInterruptedEvent = new Event(AD_INTERRUPTED_EVENT_NAME);
const AD_RESPONSE_TIMEOUT = 2000;

let cachedShowAdFn: Nullable<() => void> = null;

export const useGoogleH5Ads = (useAdsOptionally = false) => {
  const { sendBasicConversionEvent } = useConversionEvents();
  const [adsBlocked, setAdsBlocked] = useState(window.adsBlocked);
  const [enableLogging] = useBooleanFeatureFlag('googleAdsRewards', false);
  const [loading, setLoading] = useState(false);
  const adRequestTimeout = useRef<SetTimeoutId>();

  useMountEffect(() => {
    return () => {
      // due to react strict mode the component is mounted twice in local, so the timeout is cleared too early
      // use production build to verify if this works
      clearTimeout(adRequestTimeout.current);
    };
  });

  const requestAd = useCallback(() => {
    if (cachedShowAdFn) {
      return;
    }

    if (!adsBlocked) {
      adRequestTimeout.current = setTimeout(() => {
        if (useAdsOptionally) {
          // stop waiting for ads if no ad has been received by this time
          setLoading(false);
          return;
        }

        // set adsBlocked flag so user will know that google adsense doesn't respond for some reason (e.g. ad blocker)
        window.adsBlocked = true;
        setAdsBlocked(true);
      }, AD_RESPONSE_TIMEOUT);
    }

    setLoading(true);
    adBreak({
      type: 'reward',
      name: 'noice_rewards',
      beforeReward: (showAdFn) => {
        cachedShowAdFn = showAdFn;
        setLoading(false);
        clearTimeout(adRequestTimeout.current);
      },
      adDismissed: () => {
        cachedShowAdFn = null;
        window.dispatchEvent(adDismissedEvent);
      },
      adViewed: () => {
        cachedShowAdFn = null;
        sendBasicConversionEvent('AdViewed');
        window.dispatchEvent(adViewedEvent);
      },
      adBreakDone: (data) => {
        // google may not send us an ad due to some reason
        setLoading(false);
        clearTimeout(adRequestTimeout.current);

        if (data.breakStatus === 'other') {
          window.dispatchEvent(adInterruptedEvent);
        }

        if (enableLogging) {
          logInfo('adBreakDone placementInfo', data);
        }
      },
    });
  }, [adsBlocked, enableLogging, sendBasicConversionEvent, useAdsOptionally]);

  return { requestAd, showAdFn: cachedShowAdFn, loading, adsBlocked };
};
