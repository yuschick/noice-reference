import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useClient } from '@noice-com/common-react-core';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Path, Svg } from 'react-native-svg';
import { create } from 'zustand';

import { CurrencyPill } from '../CurrencyPill';
import { HStack } from '../Stack/HStack';

import { useAdsButtonSegments } from './useAdsButtonSegments.hook';

import { LoadingView } from '@components/LoadingView';
import { useToasts } from '@components/Toast/hooks/useToasts.hook';
import { colors } from '@constants/styles';
import {
  AdsRewardDescriptionPrizeDescriptionKind,
  useCurrenciesQuery,
  useTimeAdsRewardsQuery,
} from '@gen/graphql';
import { useMountEffect } from '@hooks/useMountEffect.hook';
import {
  AuthenticatedNavigationHookProps,
  TabNavigatorTabParams,
} from '@navigators/routes';
import {
  WalletCurrencyId,
  filterAvailableRewards,
  getWalletCurrencyId,
} from '@utils/currency';
import { IconAssets } from '@utils/icons';
import { ImageAssets } from '@utils/image';
import { TIMED_REWARDS_PLACEMENT_ID } from '@views/Authenticated/RewardedVideoView/rewardedVideoUtils';

gql`
  query TimeAdsRewards($placementId: ID!) {
    placement(placementId: $placementId) {
      placementId
      rewards {
        ...AvailableRewards
      }
    }
  }
  query Currencies($userId: ID!) {
    wallet(userId: $userId) {
      wallet {
        currencies {
          currencyId
          currencyAmount
        }
      }
    }
  }
`;

type Props = {
  actionsDisabled: boolean;
  name: keyof TabNavigatorTabParams;
  userId: string | null;
};

const purchableToken = new Map([
  ['hard-currency', 'credits'],
  ['reshuffle-token', 'reshuffle tokens'],
]);

type HeaderStore = {
  notificationsListener?: () => void;
  setNotificationsListener: (listener?: () => void) => void;
};

const useHeaderStore = create<HeaderStore>((set) => ({
  notificationsListener: undefined,
  setNotificationsListener: (listener) => set({ notificationsListener: listener }),
}));

export const HeaderCurrencies = ({ actionsDisabled, name, userId }: Props) => {
  const navigation = useNavigation<AuthenticatedNavigationHookProps>();
  const { addToast } = useToasts();
  const client = useClient();

  // We dont unmount tab views so we might end up with several listeners
  const { notificationsListener, setNotificationsListener } = useHeaderStore();

  const {
    data: currencyData,
    refetch: refetchCurrencies,
    loading: currenciesLoading,
  } = useCurrenciesQuery({
    ...variablesOrSkip({ userId }),
  });

  const { data: rewards, refetch: refetchAdRewards } = useTimeAdsRewardsQuery({
    variables: {
      placementId: TIMED_REWARDS_PLACEMENT_ID,
    },
  });

  const navigateToAds = () => {
    navigation.navigate('rewardedVideo', {
      returnRoute: name,
    });
  };

  useMountEffect(() => {
    notificationsListener?.();

    const listener = client.NotificationService.notifications({
      onWalletTransaction(_, ev) {
        if (ev.transaction?.reason?.purchaseWithPayment) {
          for (const operation of ev.transaction.operations ?? []) {
            const tokenName = purchableToken.get(operation.currencyId ?? '');

            if (!tokenName) {
              continue;
            }

            addToast({
              title: `You got ${operation.currencyAmount} ${tokenName}`,
              icon: (
                <IconAssets.CheckCircle
                  color={colors.blackMain}
                  height={24}
                  width={24}
                />
              ),
            });
          }
        }

        refetchCurrencies();
      },
    });

    setNotificationsListener(listener);

    const navigationListener = navigation.addListener('focus', () => {
      refetchCurrencies();
      refetchAdRewards();
    });

    return () => {
      navigationListener();
      listener();
      setNotificationsListener(undefined);
    };
  });

  const currencies = currencyData?.wallet?.wallet.currencies?.reduce<
    Record<WalletCurrencyId, number>
  >(
    (prev, cur) => {
      const currencyId = getWalletCurrencyId(cur.currencyId);

      if (!currencyId) {
        return prev;
      }

      return {
        ...prev,
        [currencyId]: cur.currencyAmount,
      };
    },
    {
      [WalletCurrencyId.ChannelCurrency]: 0,
      [WalletCurrencyId.HardCurrency]: 0,
      [WalletCurrencyId.ReshuffleToken]: 0,
      [WalletCurrencyId.SoftCurrency]: 0,
    },
  );

  const availableRewardsAmount = filterAvailableRewards(
    rewards?.placement?.rewards ?? [],
  ).length;

  return (
    <HStack
      justifyContent="space-between"
      padding={[8, 16, 0]}
    >
      {!currenciesLoading && !!currencies && (
        <HStack
          alignItems="center"
          spacing={4}
        >
          <CurrencyPill
            kind={AdsRewardDescriptionPrizeDescriptionKind.KindCurrency}
            value={currencies[WalletCurrencyId.HardCurrency]}
          />
          <CurrencyPill
            kind={AdsRewardDescriptionPrizeDescriptionKind.KindExperiencePoints}
            value={currencies[WalletCurrencyId.SoftCurrency]}
          />
          <CurrencyPill
            kind={AdsRewardDescriptionPrizeDescriptionKind.KindUnspecified}
            value={currencies[WalletCurrencyId.ReshuffleToken]}
          />
        </HStack>
      )}
      {currenciesLoading && (
        <HStack
          alignItems="center"
          spacing={4}
        >
          <LoadingView style={s.currencyPlaceholder} />
          <LoadingView style={s.currencyPlaceholder} />
          <LoadingView style={s.currencyPlaceholder} />
        </HStack>
      )}
      <AdsButton
        adsExist={!!rewards?.placement}
        disabled={actionsDisabled}
        maxSegments={rewards?.placement?.rewards.length ?? 0}
        segmentAmount={availableRewardsAmount}
        onPress={navigateToAds}
      />
    </HStack>
  );
};

const SEGMENT_STROKE_WIDTH = 8;
const EMPTY_SEGMENT_STROKE_WIDTH = 6;

const AdsButton = ({
  disabled,
  onPress,
  maxSegments = 3,
  segmentAmount = 2,
  adsExist,
}: TouchableOpacityProps & {
  maxSegments: number;
  adsExist: boolean;
  segmentAmount: number;
}) => {
  const pulse = useSharedValue(1);
  const { segments, emptySegment } = useAdsButtonSegments({
    maxSegments,
    segmentAmount,
  });

  useEffect(() => {
    // loop the animation for 5 times
    pulse.value = withRepeat(withTiming(1.3, { duration: 1500 }), 6, true);
  }, [pulse, segmentAmount]);

  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: pulse.value,
        },
      ],
    };
  });

  const outlineStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(pulse.value, [1, 1.2], [1, 0]),
    };
  });

  if (!adsExist) {
    return null;
  }

  const showEmptyPath = maxSegments !== segmentAmount;

  return (
    <TouchableOpacity
      aria-label={`You have ${segmentAmount} available rewards`}
      disabled={disabled}
      style={s.boxContainer}
      onPress={onPress}
    >
      <Animated.View style={[s.svg, outlineStyle]}>
        <Svg
          height="30"
          style={s.svg}
          viewBox="0 0 100 100"
          width="30"
        >
          {segments.map((segment, index) => {
            return (
              <Path
                d={segment}
                fill="none"
                key={`seg_${index}`}
                stroke={colors.tealMain}
                strokeLinecap="round"
                strokeWidth={SEGMENT_STROKE_WIDTH}
              />
            );
          })}
          {showEmptyPath && (
            <Path
              d={emptySegment}
              fill="none"
              stroke={colors.tealMain}
              strokeLinecap="round"
              strokeWidth={EMPTY_SEGMENT_STROKE_WIDTH}
            />
          )}
        </Svg>
      </Animated.View>
      <Animated.Image
        source={ImageAssets.rewardBoxGold}
        style={[s.image, imageStyle]}
      />
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  svg: {
    ...StyleSheet.absoluteFillObject,
  },
  currencyPlaceholder: {
    borderRadius: 100,
    height: 30,
    width: 70,
  },
  boxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 30,
    width: 30,
  },
  image: {
    width: 20,
    height: 20,
  },
});
