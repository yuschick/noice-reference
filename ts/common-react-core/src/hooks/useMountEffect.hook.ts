import { EffectCallback, useEffect } from 'react';

export function useMountEffect(effect: EffectCallback) {
  // Because this hook was designed to work as useEffect BUT
  // only covering mount/unmount scenarios, we don't add dependencies for useEffect.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
}
