import { Operation } from '@noice-com/schemas/wallet/wallet.pb';
import { Nullable } from '@noice-com/utils';
import { Fragment } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, Easing, FadeInDown } from 'react-native-reanimated';

import { currencyImageMap, currencyRewardGlow } from './rewardedVideoUtils';

import { Gutter } from '@components/Gutter';
import { SpriteSheet } from '@components/SpriteSheet';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { WalletCurrencyId } from '@utils/currency';

type Props = {
  receivedWalletRewards: Nullable<Operation[]>;
};

const FX_IMAGE_SIZE = 164;
const IMAGE_WIDTH = 92;

export const ReceivedRewardsInfo = ({ receivedWalletRewards }: Props) => {
  const fxAnimations = {
    default: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  };

  return (
    <VStack style={s.container}>
      <Typography
        color="textSecondary"
        fontSize="lg"
        fontWeight="medium"
        textAlign="center"
        uppercase
      >
        Your reward
      </Typography>
      <Gutter height={24} />
      <HStack
        justifyContent="space-around"
        spacing={8}
        style={s.row}
      >
        {receivedWalletRewards?.map((reward) => (
          <Fragment key={reward.currencyId}>
            <VStack
              alignItems="center"
              key={'key-' + reward.currencyId + reward.type}
              style={s.itemWrapper}
            >
              <Animated.View
                entering={FadeIn.delay(400)}
                style={s.spriteSheetWrapper}
              >
                <SpriteSheet
                  animationName="default"
                  animations={fxAnimations}
                  imageSize={FX_IMAGE_SIZE}
                  source={currencyRewardGlow[reward.currencyId as WalletCurrencyId]}
                  spriteSheetCols={10}
                  spriteSheetRows={1}
                  alternate
                  autoPlay
                  loop
                />
              </Animated.View>
              <Animated.Image
                entering={FadeInDown.duration(800).delay(400).easing(Easing.elastic(2.5))}
                resizeMode="contain"
                source={currencyImageMap[reward.currencyId as WalletCurrencyId]}
                style={s.image}
              />
              <Gutter height={12} />
              {!!reward.currencyAmount && (
                <Animated.View entering={FadeIn.delay(600)}>
                  <Typography
                    fontSize="xxxl"
                    fontWeight="extraBold"
                    numberOfLines={1}
                    textAlign="center"
                  >
                    {reward.currencyAmount}
                  </Typography>
                </Animated.View>
              )}
            </VStack>
          </Fragment>
        ))}
      </HStack>
    </VStack>
  );
};

const s = StyleSheet.create({
  row: { flexWrap: 'wrap', rowGap: 64 },
  container: {
    paddingHorizontal: 24,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
  },
  itemWrapper: {
    overflow: 'visible',
  },
  spriteSheetWrapper: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
    alignItems: 'center',
    transform: [{ translateY: 64 }],
  },
});
