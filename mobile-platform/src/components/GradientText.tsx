import { Fragment, useCallback, useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  Text as RNText,
  StyleSheet,
  TextStyle,
  View,
} from 'react-native';
import { Defs, LinearGradient, Stop, Svg, Text } from 'react-native-svg';

import { colors, typography } from '@constants/styles';

interface Props {
  fontSize?: keyof typeof typography.fontSize;
  fontWeight?: keyof typeof typography.fontWeight;
  fontFamily?: keyof typeof typography.fontFamily;
  uppercase?: boolean;
  textAlign?: TextStyle['textAlign'];
  children: string;
  gradientStart?: string;
  gradientEnd?: string;
}

type TextTransforOption = 'uppercase' | 'none' | 'capitalize' | 'lowercase' | undefined;

export const GradientText = ({
  children,
  fontSize = 'md',
  fontWeight = 'regular',
  fontFamily = 'main',
  uppercase,
  gradientStart = colors.violet400,
  gradientEnd = colors.magenta500,
}: Props) => {
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  // no LineHeight on Svg Text
  const styles: TextStyle = useMemo(
    () => ({
      fontSize: typography.fontSize[fontSize] ?? typography.fontSize.md,
      fontWeight: `${typography.fontWeight[fontWeight]}`,
      fontFamily: typography.fontFamily[fontFamily],
      textTransform: uppercase ? 'uppercase' : ('none' as TextTransforOption),
    }),

    [fontFamily, fontSize, fontWeight, uppercase],
  );

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  }, []);

  // react-native-svg Text does not support uppercase
  const text = uppercase ? children.toUpperCase() : children;

  return (
    <Fragment>
      {/* Renders a hidden text element to calculate the width and height needed for the Svg element. 
      This is done so that the GradientText aligns vertically with Text elements,
      and also so it grows horizontally for longer texts */}
      <View
        style={hiddenStyles.container}
        onLayout={onLayout}
      >
        <RNText style={[styles, hiddenStyles.text]}>{children}</RNText>
      </View>
      <Svg
        height={dimensions.height}
        width={dimensions.width}
      >
        <Defs>
          <LinearGradient
            id="gradient"
            x1="0%"
            x2="100%"
            y1="0%"
            y2="0%"
          >
            <Stop
              offset="0%"
              stopColor={gradientStart}
            />
            <Stop
              offset="100%"
              stopColor={gradientEnd}
            />
          </LinearGradient>
        </Defs>
        <Text
          dy="25%"
          fill="url(#gradient)"
          fontFamily={styles.fontFamily}
          fontSize={styles.fontSize}
          fontWeight={styles.fontWeight}
          x="0"
          y="50%"
        >
          {text}
        </Text>
      </Svg>
    </Fragment>
  );
};

const hiddenStyles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  text: {
    opacity: 0,
  },
});
