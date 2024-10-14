import { useWindowSize } from './useWindowSize.hook';

export function useWindowWidth(): number {
  const { width } = useWindowSize();

  return width;
}
