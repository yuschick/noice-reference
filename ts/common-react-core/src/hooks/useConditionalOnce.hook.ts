import { Nullable } from '@noice-com/utils';
import { EffectCallback, useEffect, useRef } from 'react';

import { useMountEffect } from './useMountEffect.hook';

export function useConditionalOnce(effect: EffectCallback, condition: boolean) {
  const hasRun = useRef(false);
  const destructor = useRef<Nullable<ReturnType<EffectCallback>>>(null);

  // Because this hook was designed to work as useEffect BUT
  // only covering mount/unmount scenarios, we don't add dependencies for useEffect.
  useEffect(() => {
    if (!hasRun.current && condition) {
      hasRun.current = true;
      destructor.current = effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition]);

  useMountEffect(() => {
    return () => {
      destructor.current?.();
    };
  });
}
