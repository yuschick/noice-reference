import { Nullable } from '@noice-com/utils';

/**
 * Provides circular navigation indexes for browsing arrays
 * @param collection?: unknown[] The collection to browse
 * @param index?: number Current index
 * @returns [
 *   previousIndex: number,
 *   nextIndex: number,
 * ]
 */
export const useCircularArrayNavigation = (
  collection?: unknown[] | Nullable<unknown[]>,
  index?: number,
): [number, number] => {
  const length = collection?.length ?? 0;
  const idx = index ?? 0;
  const nextIndex = (idx + 1) % length;
  const previousIndex = idx === 0 ? length - 1 : idx - 1;

  return [previousIndex, nextIndex];
};
