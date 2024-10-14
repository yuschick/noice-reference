import { StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import LoadingSpinner from '@components/LoadingSpinner';
import { Typography } from '@components/Typography';
import { borderRadius, colors } from '@constants/styles';

type Props = {
  text: string;
  price: string;
  onPress: () => void;
  isLoading?: boolean;
};

export const SubscribeButton = ({ text, price, onPress, isLoading }: Props) => {
  return (
    <TouchableOpacity
      disabled={isLoading}
      style={[
        s.subscribeButton,
        // eslint-disable-next-line react-native/no-inline-styles
        { opacity: isLoading ? 0.25 : 1 },
      ]}
      onPress={onPress}
    >
      <View style={s.textContainer}>
        <LinearGradient
          colors={[colors.greenMain, colors.tealMain]}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={{ ...StyleSheet.absoluteFillObject }}
        />
        <Typography
          color="darkMain"
          fontSize="md"
          fontWeight="medium"
          lineHeight="lg"
          uppercase
        >
          {text}
        </Typography>
      </View>

      <View style={s.priceContainer}>
        <Typography
          allowFontScaling={false}
          color="whiteMain"
          fontSize="md"
          fontWeight="medium"
          lineHeight="lg"
          uppercase
        >
          {price}/MONTH
        </Typography>
      </View>

      {isLoading && (
        <View style={s.loading}>
          <LoadingSpinner size="sm" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  subscribeButton: {
    borderRadius: borderRadius.radius2xl,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  textContainer: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  priceContainer: {
    backgroundColor: colors.teal700,
    height: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.blue400,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
