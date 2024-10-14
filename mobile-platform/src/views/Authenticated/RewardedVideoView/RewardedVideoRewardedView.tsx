import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';

import { ReceivedRewardsInfo } from './ReceivedRewardsInfo';

import { RewardChest } from '@components/Ads/RewardChest';
import { ButtonLarge } from '@components/ButtonLarge';
import { CurrencyInfoRow } from '@components/CurrencyInfoRow';
import { PageLayout } from '@components/PageLayout';
import { useMountEffect } from '@hooks/useMountEffect.hook';
import { RootNavigatorScreenProps } from '@navigators/routes';

export function RewardedVideoRewardedView({
  navigation,
  route,
}: RootNavigatorScreenProps<'rewardedVideoRewarded'>) {
  const { receivedRewards, rewardRarity } = route.params;
  const chestAnimation = useSharedValue(0);
  const window = useWindowDimensions();

  useMountEffect(() => {
    chestAnimation.value = withDelay(
      600,
      withTiming(1, {
        duration: 600,
      }),
    );
  });

  const footer = useMemo(
    () => (
      <PageLayout.Footer>
        <ButtonLarge
          analyticsActionName="CLAIM_REWARD"
          backgroundColor={['green500', 'teal500']}
          textColor="textDark"
          onPress={navigation.popToTop}
        >
          Claim reward
        </ButtonLarge>
      </PageLayout.Footer>
    ),
    [navigation],
  );

  const chestAnimationStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: interpolate(chestAnimation.value, [0, 1], [0, window.height]),
        },
      ],
    }),
    [],
  );

  return (
    <>
      <PageLayout
        container="view"
        footer={footer}
        style={s.container}
      >
        <View style={s.header}>
          <CurrencyInfoRow />
        </View>
        <Animated.View
          entering={ZoomIn.duration(400).easing(Easing.elastic(2))}
          style={s.chestWrapper}
        >
          <Animated.View style={chestAnimationStyle}>
            <RewardChest
              animationName="open"
              rarity={rewardRarity}
              size={240}
            />
          </Animated.View>
        </Animated.View>
        <Animated.View entering={FadeIn.delay(1000).duration(400)}>
          <ReceivedRewardsInfo receivedWalletRewards={receivedRewards} />
        </Animated.View>
      </PageLayout>
    </>
  );
}

const s = StyleSheet.create({
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'center',
    flex: 1,
  },
  chestWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
