import { useEffect, useState } from 'react';

interface Props {
  callback?: (devicePixelRatio: number) => void;
}

interface HookResult {
  devicePixelRatio: number;
}

function getDevicePixelRatioMediaQuery() {
  const mqString = `(resolution: ${window.devicePixelRatio}dppx)`;

  return matchMedia(mqString);
}

export function useDevicePixelRatioChange({ callback }: Props): HookResult {
  const [devicePixelRatio, setDevicePixelRatio] = useState<number>(
    window.devicePixelRatio,
  );

  useEffect(() => {
    const handleMediaQueryChange = () => {
      setDevicePixelRatio(window.devicePixelRatio);
      callback?.(window.devicePixelRatio);
    };

    const media = getDevicePixelRatioMediaQuery();

    media.addEventListener('change', handleMediaQueryChange);

    return () => {
      media.removeEventListener('change', handleMediaQueryChange);
    };
  }, [callback, devicePixelRatio]);

  return { devicePixelRatio };
}
