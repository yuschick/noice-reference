import { NativeScrollEvent } from 'react-native';

/**
 * Use to check in onScroll callbacks in any list type if scroll is close to bottom
 * of the list.
 */
export const isCloseToBottom = (
  { layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent,
  offsetBottom = 20,
) => {
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - offsetBottom;
};

/**
 * Use to check in onScroll callbacks in any list type if scroll is close to top
 * of the list.
 */
export const isCloseToTop = ({ contentOffset }: NativeScrollEvent, offsetTop = -10) => {
  return contentOffset.y <= offsetTop;
};

/**
 * Use to check in onScroll/onScrollEnd callbacks in any list type if scroll is further
 * than the bottom of the list.
 */
export const isPassedBottom = (
  { layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent,
  buffer = 40,
) => {
  return layoutMeasurement.height + contentOffset.y >= contentSize.height + buffer;
};
