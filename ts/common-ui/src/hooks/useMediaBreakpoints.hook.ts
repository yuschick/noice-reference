import { useMemo } from 'react';

import { useWindowWidth } from './useWindowWidth.hook';

interface HookProps<T> {
  xxxlarge?: T;
  xxlarge?: T;
  xlarge?: T;
  large?: T;
  medium?: T;
  small?: T;
  default: T;
}

const breakpoints = new Map<keyof HookProps<string>, string>([
  ['xxxlarge', '(min-width: 1920px)'],
  ['xxlarge', '(min-width: 1536px)'],
  ['xlarge', '(min-width: 1280px)'],
  ['large', '(min-width: 1024px)'],
  ['medium', '(min-width: 640px)'],
  ['small', '(max-width: 640px)'],
]);

export function useMediaBreakpoints<T>(props: HookProps<T>) {
  const windowWidth = useWindowWidth();

  const breakpoint = useMemo(() => {
    for (const [key, value] of breakpoints) {
      if (window.matchMedia(value).matches) {
        return props[key] ?? props.default;
      }
    }

    return props.default;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, windowWidth]);

  return breakpoint;
}
