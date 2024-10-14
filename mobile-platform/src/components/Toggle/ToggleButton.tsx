import { useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import LoadingSpinner from '@components/LoadingSpinner';
import { HStack } from '@components/Stack/HStack';
import { colors } from '@constants/styles';
import { Haptic } from '@utils/haptic';

export interface ToggleButtonProps {
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  isLoading?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const TOGGLE_WIDTH = 50;
const TOGGLE_PADDING = 4;
const KNOB_SIZE = 16;

export const ToggleButton = ({ enabled, onToggle, isLoading }: ToggleButtonProps) => {
  const enabledAnimation = useSharedValue(enabled ? 1 : 0);

  useEffect(() => {
    enabledAnimation.value = withTiming(enabled ? 1 : 0, {
      duration: 200,
      easing: Easing.elastic(0.5),
    });
  }, [enabled, enabledAnimation]);

  const toggleStyles = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      enabledAnimation.value,
      [0, 1],
      [colors.textLightSecondary, colors.greenMain],
    ),
  }));

  const knobStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          enabledAnimation.value,
          [0, 1],
          [0, TOGGLE_WIDTH - KNOB_SIZE - TOGGLE_PADDING * 2],
        ),
      },
    ],
  }));

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const _onToggle = () => {
    Haptic.impactLight();
    onToggle?.(!enabled);
  };

  return (
    <HStack
      alignItems="center"
      spacing={8}
    >
      <AnimatedTouchable
        accessibilityRole="switch"
        aria-checked={enabled}
        hitSlop={16}
        style={[s.toggle, toggleStyles]}
        onPress={_onToggle}
      >
        <Animated.View
          style={[
            s.knob,
            knobStyles,
            { backgroundColor: isLoading ? colors.transparent : colors.white },
          ]}
        >
          {isLoading && <LoadingSpinner size="xs" />}
        </Animated.View>
      </AnimatedTouchable>
    </HStack>
  );
};

const s = StyleSheet.create({
  toggle: {
    borderRadius: TOGGLE_WIDTH / 2,
    width: TOGGLE_WIDTH,
    padding: TOGGLE_PADDING,
    backgroundColor: colors.textLightSecondary,
  },
  knob: {
    borderRadius: KNOB_SIZE,
    height: KNOB_SIZE,
    width: KNOB_SIZE,
  },
});
