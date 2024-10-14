import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { borderRadius, colors } from '@constants/styles';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export const DisplayCard = ({ style, children }: PropsWithChildren<Props>) => {
  return (
    <View style={[s.container, style]}>
      <LinearGradient
        colors={[colors.greenMain, colors.tealMain, colors.magentaMain]}
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 0 }}
        style={s.gradient}
      />
      {children}
    </View>
  );
};

const s = StyleSheet.create({
  gradient: {
    position: 'absolute',
    top: 0,
    height: 4,
    left: 0,
    right: 0,
  },
  container: {
    padding: 16,
    borderRadius: borderRadius.radiusLg,
    backgroundColor: colors.whiteMain,
    overflow: 'hidden',
  },
});
