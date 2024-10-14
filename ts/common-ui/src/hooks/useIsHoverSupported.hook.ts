import { useMediaQuery } from './useMediaQuery.hook';

export function useIsHoverSupported(): boolean {
  const isHoverSupported = useMediaQuery('(hover: hover)');

  return isHoverSupported;
}
