import { useMemo } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  GestureResponderEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { borderRadius, colors } from '@constants/styles';
import { Haptic } from '@utils/haptic';

type IconColors = keyof typeof colors;

interface Props extends TouchableOpacityProps {
  backgroundColor?: IconColors | IconColors[];
  children?: React.ReactNode;
  disableHaptic?: boolean;
}

export const ButtonIcon = ({
  backgroundColor = 'whiteTransparent10',
  children,
  disableHaptic,
  ...rest
}: Props) => {
  const onPressOut = (event: GestureResponderEvent) => {
    !disableHaptic && Haptic.impactLight();
    rest?.onPressOut?.(event);
  };

  const isGradient = Array.isArray(backgroundColor);

  const gradient = useMemo(() => {
    if (!isGradient) {
      return [];
    }

    return backgroundColor.map((color) => colors[color]);
  }, [backgroundColor, isGradient]);

  return (
    <TouchableOpacity
      {...rest}
      activeOpacity={0.75}
      style={[
        s.container,
        { backgroundColor: !isGradient ? colors[backgroundColor] : undefined },
        rest.style,
        rest.disabled && s.disabled,
      ]}
      onPressOut={onPressOut}
    >
      {isGradient && (
        <LinearGradient
          colors={gradient}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={s.gradient}
        />
      )}
      {children}
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: borderRadius.radiusXl,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  disabled: {
    backgroundColor: colors.gray50Transparent10,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
