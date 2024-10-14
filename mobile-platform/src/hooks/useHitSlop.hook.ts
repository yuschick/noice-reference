import { useCallback, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

const getHitSlop = (size: { width: number; height: number }) => {
  // hitslop should be 44dp according to Apple's HIG
  // https://developer.apple.com/design/human-interface-guidelines/accessibility
  // if element is larger use it, otherwise use 44

  const hitSlop = 44;
  const x = Math.max(hitSlop - size.width, 0);
  const y = Math.max(hitSlop - size.height, 0);

  return {
    top: y / 2,
    bottom: y / 2,
    left: x / 2,
    right: x / 2,
  };
};

export const useHitSlop = (): [
  {
    top: number;
    bottom: number;
    left: number;
    right: number;
  },
  (event: LayoutChangeEvent) => void,
] => {
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });

  const onLayout = useCallback(
    ({
      nativeEvent: {
        layout: { width, height },
      },
    }: LayoutChangeEvent) => {
      if (width !== frameSize.width && height !== frameSize.height) {
        setFrameSize({ width, height });
      }
    },
    [frameSize],
  );

  return [getHitSlop(frameSize), onLayout];
};
