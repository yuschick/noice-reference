import { useRef } from 'react';
import { Animated, PanResponder } from 'react-native';

interface AnimateDefaultModalHookProps {
  maxDragDistance: number;
  windowWidth: number;
  modalMaxXDrag: number;
  isEnabled: boolean;
  resetPositionDuration: number;
  onClose?: () => void;
}

export const useAnimateDefaultModal = ({
  maxDragDistance,
  windowWidth,
  modalMaxXDrag,
  isEnabled,
  resetPositionDuration,
  onClose,
}: AnimateDefaultModalHookProps) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => isEnabled,
      onStartShouldSetPanResponder: () => isEnabled,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();

        // @ts-ignore
        if (pan.y._value >= maxDragDistance || pan.y._value <= -maxDragDistance) {
          onClose?.();
        }

        Animated.timing(pan, {
          duration: resetPositionDuration,
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  const opacity = pan.y.interpolate({
    inputRange: [-maxDragDistance, 0, maxDragDistance],
    outputRange: [0, 1, 0],
  });

  const scale = pan.y.interpolate({
    inputRange: [-maxDragDistance, 0, maxDragDistance],
    outputRange: [0.95, 1, 0.95],
  });

  const clampedX = pan.x.interpolate({
    inputRange: [-windowWidth, 0, windowWidth],
    outputRange: [-modalMaxXDrag, 0, modalMaxXDrag],
    extrapolate: 'clamp',
  });

  const rotateZ = pan.x.interpolate({
    inputRange: [-windowWidth, 0, windowWidth],
    outputRange: ['-2deg', '0deg', '2deg'],
  });

  return {
    panResponder,
    opacity,
    scale,
    clampedX,
    rotateZ,
    pan,
  };
};
