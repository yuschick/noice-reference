import { Nullable } from '@noice-com/utils';
import { useEffect, useRef } from 'react';

import { useIsLandscape } from '@hooks/useIsLandscape.hook';
import { IOSHomeIndicatorModule } from '@native/HomeIndicatorModule';

const HIDE_DELAY = 2000;

export const useAutoHideIndicator = () => {
  const { isLandscape } = useIsLandscape();
  // This defaults to false so if there the first run isLandscape is true,
  // it will trigger the preference change correctly
  const prevValue = useRef(false);
  const timeoutRef = useRef<Nullable<number>>(null);

  useEffect(() => {
    if (isLandscape === prevValue.current) {
      return;
    }

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const shouldHide = isLandscape;
      prevValue.current = shouldHide;
      IOSHomeIndicatorModule.setHomeIndicatorPreference(shouldHide);
      timeoutRef.current = null;
    }, HIDE_DELAY);
  }, [isLandscape]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      IOSHomeIndicatorModule.setHomeIndicatorPreference(false);
    };
  }, []);
};
