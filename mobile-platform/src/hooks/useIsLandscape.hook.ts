import { useState } from 'react';
import Orientation, { OrientationType } from 'react-native-orientation-locker';

import { useMountEffect } from './useMountEffect.hook';

/**
 * Keeps track of the current device & simulated orientation
 * @returns
 */
export const useIsLandscape = () => {
  const [isLandscape, setIsLandscape] = useState(false);
  const [isDeviceLandscape, setIsDeviceLandscape] = useState(false);

  useMountEffect(() => {
    const handleDeviceOrientationChange = (orientation: OrientationType) => {
      setIsDeviceLandscape(
        orientation === OrientationType['LANDSCAPE-LEFT'] ||
          orientation === OrientationType['LANDSCAPE-RIGHT'],
      );
    };

    const handleOrientationChange = (orientation: OrientationType) => {
      setIsLandscape(
        orientation === OrientationType['LANDSCAPE-LEFT'] ||
          orientation === OrientationType['LANDSCAPE-RIGHT'],
      );
    };

    Orientation.getDeviceOrientation(handleDeviceOrientationChange);
    Orientation.getOrientation(handleOrientationChange);

    Orientation.addDeviceOrientationListener(handleDeviceOrientationChange);
    Orientation.addOrientationListener(handleOrientationChange);

    return () => {
      Orientation.removeOrientationListener(handleOrientationChange);
      Orientation.removeDeviceOrientationListener(handleDeviceOrientationChange);
    };
  });

  return {
    isLandscape,
    isDeviceLandscape,
  };
};
