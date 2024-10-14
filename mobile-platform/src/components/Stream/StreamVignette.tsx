import { StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { Defs, RadialGradient, Rect, Stop, Svg } from 'react-native-svg';

type Props = {
  style?: StyleProp<ViewStyle>;
};

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
export const StreamVignette = ({ style }: Props) => {
  return (
    <AnimatedSvg
      height="100%"
      preserveAspectRatio="none"
      style={style}
      viewBox="0 0 100 100"
      width="100%"
    >
      <Defs>
        <RadialGradient
          cx="50%"
          cy="50%"
          id="grad"
          r="50%"
        >
          <Stop
            offset="0%"
            stopColor="black"
            stopOpacity="0"
          />
          <Stop
            offset="70%"
            stopColor="black"
            stopOpacity="0.2"
          />
          <Stop
            offset="100%"
            stopColor="black"
            stopOpacity="0.5"
          />
        </RadialGradient>
      </Defs>
      <Rect
        fill="url(#grad)"
        height="100%"
        width="100%"
      />
    </AnimatedSvg>
  );
};
