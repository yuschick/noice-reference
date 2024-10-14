import { Nullable } from '@noice-com/utils';
import { useRef, useEffect } from 'react';

type Callback = () => void;

export function useInterval(callback: Callback, delay: number | null) {
  const callbackRef = useRef<Nullable<Callback>>(null);

  // update callback function with current render callback that has access to latest props and state
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay) {
      return () => {};
    }

    const interval = setInterval(() => {
      callbackRef.current && callbackRef.current();
    }, delay);

    return () => clearInterval(interval);
  }, [delay]);
}
