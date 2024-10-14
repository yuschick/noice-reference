import isEqual from 'lodash/isEqual';
import { useRef } from 'react';

export function useDeepMemo<V = unknown>(valueToMemo: V): V {
  const ref = useRef<V>(valueToMemo);

  if (!isEqual(valueToMemo, ref.current)) {
    ref.current = valueToMemo;
  }

  return ref.current;
}
