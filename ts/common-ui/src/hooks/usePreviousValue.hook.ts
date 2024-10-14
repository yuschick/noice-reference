import { useRef } from 'react';

/**
 * A hook that returns the previous value of a variable.
 * If value is still original, the previous value will be the same as the current value.
 * Implementation based on https://www.developerway.com/posts/implementing-advanced-use-previous-hook
 */
export const usePreviousValue = <T>(value: T): T => {
  const ref = useRef<{
    value: T;
    prev: T;
  }>({
    value: value,
    prev: value,
  });

  const current = ref.current.value;

  // Update the ref only if the current value has changed
  if (value !== current) {
    ref.current = {
      value: value,
      prev: current,
    };
  }

  return ref.current.prev;
};
