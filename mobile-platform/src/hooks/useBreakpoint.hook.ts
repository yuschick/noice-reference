import { useWindowDimensions } from 'react-native';

import { BreakPoint, deviceBreakpoints } from '@utils/breakpoints';

type BreakPointValues<T> = Partial<Record<BreakPoint, T>>;

export const useBreakpoint = <T>(
  defaultValue: T,
  values: BreakPointValues<T>,
): T | undefined => {
  const { width } = useWindowDimensions();

  let prevBreakpoint = 0;
  for (const [key, breakpoint] of deviceBreakpoints) {
    if (width > prevBreakpoint && width <= breakpoint) {
      return values?.[key] ?? defaultValue;
    }

    prevBreakpoint = deviceBreakpoints.get(key) ?? 0;
  }

  return defaultValue;
};
