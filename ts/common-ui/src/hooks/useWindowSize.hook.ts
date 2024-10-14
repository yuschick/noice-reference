import { useMountEffect } from '@noice-com/common-react-core';
import { useRef, useState } from 'react';

import { SetTimeoutId } from '@common-types';

type HookProps = {
  width: number;
  height: number;
};

export function useWindowSize(): HookProps {
  const [windowSize, setWindowSize] = useState<HookProps>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const debounceTimeout = useRef<SetTimeoutId>();

  const handleSize = () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 100);
  };

  useMountEffect(() => {
    window.addEventListener('resize', handleSize);
    handleSize();

    return () => {
      document.body.removeEventListener('resize', handleSize);
    };
  });

  return windowSize;
}
