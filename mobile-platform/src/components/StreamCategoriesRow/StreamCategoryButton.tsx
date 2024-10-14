import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Typography } from '@components/Typography';
import { borderRadius, colors } from '@constants/styles';
import { Haptic } from '@utils/haptic';

type Props = {
  label: string;
  subtitle?: string;
  colorHighlight?: string;
  centerText?: boolean;
  onPress: () => void;
};

export const StreamCategoryButton = ({
  label,
  subtitle,
  colorHighlight,
  centerText,
  onPress,
}: Props) => {
  const press = () => {
    Haptic.impactLight();
    onPress();
  };

  return (
    <TouchableOpacity
      style={[s.container, centerText && s.center]}
      onPress={press}
    >
      <View>
        <Typography
          fontSize="md"
          fontWeight="medium"
          numberOfLines={1}
        >
          {label}
        </Typography>
        {!!subtitle && (
          <Typography
            color="textSecondary"
            fontSize="sm"
            fontWeight="regular"
            numberOfLines={1}
          >
            {subtitle}
          </Typography>
        )}
      </View>
      {!!colorHighlight && (
        <View style={[s.colorStrip, { backgroundColor: colorHighlight }]} />
      )}
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  container: {
    backgroundColor: colors.whiteTransparent10,
    height: 50,
    minWidth: 126,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    borderRadius: borderRadius.radiusXs,
    overflow: 'hidden',
  },
  center: {
    alignItems: 'center',
  },
  colorStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: 5,
  },
});
