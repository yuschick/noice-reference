import { useMemo } from 'react';
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native';

import { typography, colors } from '../constants/styles';

export interface TypographyProps extends TextProps {
  style?: StyleProp<TextStyle>;
  color?: keyof typeof colors;
  fontSize?: keyof typeof typography.fontSize;
  fontWeight?: keyof typeof typography.fontWeight;
  fontFamily?: keyof typeof typography.fontFamily;
  lineHeight?: keyof typeof typography.lineHeight;
  fontStyle?: TextStyle['fontStyle'];
  uppercase?: boolean;
  italic?: boolean;
  textAlign?: TextStyle['textAlign'];
}

export const Typography = ({
  style,
  color = 'white',
  fontSize = 'md',
  fontWeight = 'regular',
  fontFamily = 'main',
  fontStyle = 'normal',
  textAlign,
  lineHeight,
  uppercase,
  italic,
  children,
  ...rest
}: React.PropsWithChildren<TypographyProps>) => {
  const styleArr = useMemo(
    () => [
      {
        color: colors[color],
        fontSize: typography.fontSize[fontSize],
        fontWeight: typography.fontWeight[fontWeight],
        fontFamily: typography.fontFamily[fontFamily],
        lineHeight: lineHeight
          ? typography.lineHeight[lineHeight]
          : typography.lineHeight[fontSize],
        fontStyle,
        textAlign,
      },
      uppercase && s.uppercase,
      italic && s.italic,
      style,
    ],
    [
      color,
      fontFamily,
      fontSize,
      fontStyle,
      fontWeight,
      italic,
      lineHeight,
      style,
      textAlign,
      uppercase,
    ],
  );

  return (
    <Text
      {...rest}
      style={styleArr}
    >
      {children}
    </Text>
  );
};

const s = StyleSheet.create({
  uppercase: {
    textTransform: 'uppercase',
  },
  italic: {
    fontStyle: 'italic',
  },
});
