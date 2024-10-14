import { useMemo } from 'react';

/**
 * Merges an array of refs into a single memoized callback ref or `null`.
 * @see https://floating-ui.com/docs/useMergeRefs
 */
export function useMergeRefs<Instance>(
  refs: (React.Ref<Instance> | undefined)[],
): React.RefCallback<Instance> | null {
  return useMemo(() => {
    /* eslint-disable-next-line eqeqeq */
    if (refs.every((ref) => ref == null)) {
      return null;
    }

    return (value) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(value);
          /* eslint-disable-next-line eqeqeq */
        } else if (ref != null) {
          (ref as React.MutableRefObject<Instance | null>).current = value;
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}
