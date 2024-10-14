import { PropsWithChildren, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { colors } from '@constants/styles';

interface Props {
  width: number;
  color?: keyof typeof colors;
  innerRadius: number;
  style?: StyleProp<ViewStyle>;
}

export function OuterBorder({
  color,
  width,
  innerRadius,
  style = {},
  children,
}: PropsWithChildren<Props>) {
  const cachedStyles = useMemo(() => {
    return [
      style,
      {
        backgroundColor: color ? colors[color] : 'transparent',
        padding: width,
        borderRadius: innerRadius + width / 2,
      },
    ];
  }, [color, width, innerRadius, style]);

  return <View style={cachedStyles}>{children}</View>;
}
