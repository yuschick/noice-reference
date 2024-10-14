import { ReactNode } from 'react';
import { FlexStyle, StyleProp, View, ViewStyle } from 'react-native';

import { useSpacingStyle, DimensionType } from '@hooks/useSpacing';

interface Props {
  spacing?: number;
  justifyContent?: FlexStyle['justifyContent'];
  alignItems?: FlexStyle['alignItems'];
  style?: StyleProp<ViewStyle>;
  reversed?: boolean;
  children: ReactNode;
  /** Optional margin applied around the component. Can be a single value or an array for specific sides. */
  margin?: DimensionType;
  /** Optional padding applied inside the component. Can be a single value or an array for specific sides. */
  padding?: DimensionType;
  wrap?: FlexStyle['flexWrap'];
}

export const HStack = ({
  spacing = 0,
  style,
  children,
  justifyContent,
  reversed,
  alignItems,
  margin,
  padding,
  wrap,
}: Props) => {
  const flexDirection = reversed ? 'row-reverse' : 'row';
  const marginStyle = useSpacingStyle(margin, 'margin');
  const paddingStyle = useSpacingStyle(padding, 'padding');

  return (
    <View
      style={[
        {
          flexDirection,
          justifyContent,
          alignItems,
          columnGap: spacing,
          rowGap: spacing,
          flexWrap: wrap,
        },
        marginStyle,
        paddingStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
};
