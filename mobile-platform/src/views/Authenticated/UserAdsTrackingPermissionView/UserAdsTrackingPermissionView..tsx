import { StyleSheet, View } from 'react-native';
import { hasNotch } from 'react-native-device-info';
import Animated, {
  Easing,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { PageLayout } from '@components/PageLayout';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { useMountEffect } from '@hooks/useMountEffect.hook';
import TrackingPermissions from '@native/IOSTrackingPermissions';
import { AuthenticatedScreenProps } from '@navigators/routes';
import { ImageAssets } from '@utils/image';

const IMAGE_SIZE = 108;

export const UserAdsTrackingPermissionView = ({
  navigation,
  route,
}: AuthenticatedScreenProps<'userAdsTrackingPermission'>) => {
  const { permissionsRequested } = route.params;
  const currencyAnimationSoft = useSharedValue(0);
  const currencyAnimationHard = useSharedValue(0);
  const currencyAnimationReshuffle = useSharedValue(0);

  const withNotch = hasNotch();

  const promptAppleTrackingPermissions = async () => {
    await TrackingPermissions.askATTPermissions();
    permissionsRequested();

    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.popToTop();
  };

  useMountEffect(() => {
    currencyAnimationSoft.value = withDelay(
      400,
      withTiming(1, {
        duration: 400,
        easing: Easing.elastic(0.5),
      }),
    );
    currencyAnimationHard.value = withDelay(
      600,
      withTiming(1, {
        duration: 400,
        easing: Easing.elastic(1),
      }),
    );
    currencyAnimationReshuffle.value = withDelay(
      600,
      withTiming(1, {
        duration: 400,
        easing: Easing.elastic(0.5),
      }),
    );
  });

  const softCurrencyAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(currencyAnimationSoft.value, [0, 1], [-IMAGE_SIZE, 0]) },
    ],
  }));

  const hardCurrencyAnimStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(currencyAnimationHard.value, [0, 1], [-IMAGE_SIZE, 0]),
      },
    ],
  }));

  const reshuffleCurrencyAnimStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          currencyAnimationReshuffle.value,
          [0, 1],
          [IMAGE_SIZE, 0],
        ),
      },
    ],
  }));

  const footer = (
    <View style={s.footer}>
      <Typography
        color="textSecondary"
        lineHeight="xl"
      >
        You can change this option later in the settings app.
      </Typography>
      <Gutter height={24} />
      <ButtonLarge
        analyticsActionName="PROMPT_APPLE_TRACKING_PERMISSIONS"
        backgroundColor="white"
        textColor="black"
        onPress={promptAppleTrackingPermissions}
      >
        Continue
      </ButtonLarge>
      {!withNotch && <Gutter height={16} />}
    </View>
  );

  return (
    <PageLayout
      footer={footer}
      withHeader={false}
    >
      {!withNotch && <Gutter height={8} />}
      <Animated.View
        entering={FadeInDown.delay(200)}
        style={s.imageContainer}
      >
        <Animated.Image
          source={ImageAssets.CoinLg}
          style={[s.currencySoft, softCurrencyAnimStyle]}
        />
        <Animated.Image
          source={ImageAssets.CreditLg}
          style={[s.currencyHard, hardCurrencyAnimStyle]}
        />
        <Animated.Image
          source={ImageAssets.ReshuffleTokenLg}
          style={[s.currencyReshufle, reshuffleCurrencyAnimStyle]}
        />
      </Animated.View>
      <Gutter height={24} />
      <Animated.View entering={FadeInDown.delay(300)}>
        <Typography
          fontSize="xxl"
          fontWeight="bold"
        >
          Get relevant Ads
        </Typography>
      </Animated.View>
      <Gutter height={16} />
      <Animated.View entering={FadeInDown.delay(400)}>
        <Typography lineHeight="xl">
          On Noice you watch ads to get rewards. Allow tracking on next screen for watch
          advertisement that match your interest.
        </Typography>
        <Gutter height={16} />
        <Typography lineHeight="xl">
          You can continue to use the app without allowing tracking. You will still have
          the choice to watch ads to get rewards, but these ads will not be tailored to
          your interests.
        </Typography>
      </Animated.View>
    </PageLayout>
  );
};

const s = StyleSheet.create({
  footer: {
    paddingHorizontal: 16,
  },
  imageContainer: {
    height: 112,
    backgroundColor: colors.darkMain,
    borderRadius: 16,
    overflow: 'hidden',
  },
  currencySoft: {
    position: 'absolute',
    left: -24,
    top: -24,
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    objectFit: 'contain',
  },
  currencyHard: {
    position: 'absolute',
    left: '35%',
    top: -42,
    objectFit: 'contain',
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  currencyReshufle: {
    position: 'absolute',
    right: -32,
    objectFit: 'contain',
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    bottom: -42,
  },
});
