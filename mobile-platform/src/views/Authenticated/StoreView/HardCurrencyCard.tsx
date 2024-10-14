import { Image, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

import { Gutter } from '@components/Gutter';
import LoadingSpinner from '@components/LoadingSpinner';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { borderRadius, colors } from '@constants/styles';
import { ConsumableProduct } from '@hooks/purchases/useConsumablePurchases.hook';
import { ImageAssets } from '@utils/image';

export type HardCurrencyCardProps = {
  product: ConsumableProduct;
  isInProgress?: boolean;
  onPress?: () => void;
};

export const HardCurrencyCard = ({
  product,
  isInProgress,
  onPress,
}: HardCurrencyCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={s.card}
      onPress={onPress}
    >
      <LinearGradient
        colors={[colors.violet600, colors.magenta700]}
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />

      {!!product.platformDiscountPercent && product.platformDiscountPercent > 0 && (
        <View style={s.discountContainer}>
          <LinearGradient
            colors={[colors.greenMain, colors.tealMain]}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
          <Typography
            color="blackMain"
            fontSize="md"
          >
            First time offer
          </Typography>
        </View>
      )}

      <VStack
        alignItems="center"
        justifyContent="center"
      >
        <Image
          source={ImageAssets.CreditXl}
          style={s.currency}
        />
        <Gutter height={8} />
        <Typography
          fontSize="xl"
          fontWeight="bold"
        >
          {product.displayName}
        </Typography>
      </VStack>

      <Gutter height={16} />

      <HStack
        justifyContent="center"
        style={s.cardPriceContainer}
      >
        <HStack alignItems="center">
          {!isInProgress ? (
            <>
              <Typography
                fontSize="lg"
                fontWeight="medium"
              >
                {product.displayPrice}
              </Typography>
              <Gutter width={4} />
              <Typography
                color="whiteTransparent30"
                style={s.textStriked}
              >
                {product.discountOriginalPrice}
              </Typography>
            </>
          ) : (
            <LoadingSpinner size="sm" />
          )}
        </HStack>
      </HStack>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  card: {
    padding: 8,
    borderRadius: borderRadius.radiusSm,
    overflow: 'hidden',
    minHeight: 200,
    justifyContent: 'flex-end',
  },
  textStriked: {
    textDecorationLine: 'line-through',
  },
  cardPriceContainer: {
    padding: 16,
    backgroundColor: colors.blackTransparent30,
    borderRadius: borderRadius.radiusSm,
  },
  currency: {
    width: 52,
    height: 52,
  },
  discountContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderBottomRightRadius: borderRadius.radiusMd,
    overflow: 'hidden',
  },
});
