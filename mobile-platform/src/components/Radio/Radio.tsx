import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import Svg, { Circle, LinearGradient, Stop } from 'react-native-svg';

import { colors } from '@constants/styles';

export const Radio = ({ selected }: { selected: boolean }) => {
  return (
    <View>
      <Svg
        height={24}
        viewBox="0 0 24 24"
        width={24}
      >
        <Circle
          cx={12}
          cy={12}
          fill="none"
          r={10}
          stroke={selected ? 'url(#gradient)' : colors.blue350}
          strokeWidth={3}
        />
        <LinearGradient
          gradientUnits="userSpaceOnUse"
          id="gradient"
          x1="2"
          x2="22"
          y1="12"
          y2="12"
        >
          <Stop stopColor={colors.green500} />
          <Stop
            offset="1"
            stopColor={colors.teal500}
          />
        </LinearGradient>
      </Svg>

      {selected && (
        <Animated.View
          entering={ZoomIn.duration(200)}
          exiting={ZoomOut.duration(50)}
          style={s.inner}
        />
      )}
    </View>
  );
};

const s = StyleSheet.create({
  inner: {
    position: 'absolute',
    margin: 6,
    backgroundColor: colors.white,
    borderRadius: 8,
    height: 12,
    width: 12,
  },
});
