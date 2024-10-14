import { gql } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { IStreamCancel } from '@noice-com/platform-client';
import { PlacementState } from '@noice-com/schemas/ads/ads.pb';
import { Operation, OperationType } from '@noice-com/schemas/wallet/wallet.pb';
import { getErrorMessage, Nullable } from '@noice-com/utils';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { RewardContainsHint } from './RewardContainsHint';
import { RewardedVideoRow } from './RewardedVideoRow';
import {
  rewardRarityLabel,
  rewardRarityLabelColor,
  TIMED_REWARDS_PLACEMENT_ID,
} from './rewardedVideoUtils';

import { RewardChest } from '@components/Ads/RewardChest';
import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { PageLayout } from '@components/PageLayout';
import { HStack } from '@components/Stack/HStack';
import { Typography } from '@components/Typography';
import {
  RarityRarity,
  useAdsPlacementQuery,
  useAdsRewardPlacementMutation,
} from '@gen/graphql';
import { useAdNetwork } from '@hooks/useAdNetwork.hook';
import { useMountEffect } from '@hooks/useMountEffect.hook';
import { Analytics } from '@lib/Analytics';
import { InstrumentationAnalytics } from '@lib/InstrumentationAnalytics';
import { MarketingTracking } from '@lib/MarketingTracking';
import { RootNavigatorScreenProps } from '@navigators/routes';

gql`
  query AdsPlacement($placementId: ID) {
    placement(placementId: $placementId) {
      placementId
      reward {
        rarity
        readyAt
        prizes {
          kind
        }
      }
      ...RewardHint
      ...VideoRewardRow
    }
  }

  mutation AdsRewardPlacement($placementId: ID) {
    rewardPlacement(placementId: $placementId) {
      emptyTypeWorkaround
    }
  }

  ${RewardContainsHint.fragments.rewardHint}
  ${RewardedVideoRow.fragment.reward}
`;

const IS_SMALL_SCREEN = Dimensions.get('window').width <= 375;

const MAIN_REWARD_BOX_SIZE = IS_SMALL_SCREEN ? 160 : 200;

export function RewardedVideoView({
  navigation,
  route: {
    params: { returnRoute },
  },
}: RootNavigatorScreenProps<'rewardedVideo'>) {
  const client = useClient();
  const { rewardedVideoAvailable, showRewardedVideo, rewardedVideoError } =
    useAdNetwork();
  const [receivedWalletRewards, setReceivedWalletRewards] =
    useState<Nullable<Operation[]>>(null);
  const [isRewardReady, setIsRewardReady] = useState(false);
  const [readyInLabel, setReadyInLabel] = useState<string>('00:00');
  const [customErrorMessage, setCustomErrorMessage] = useState<string | null>(null);
  const cancelNotificationListener = useRef<IStreamCancel | undefined>();
  const { data } = useAdsPlacementQuery({
    variables: {
      placementId: TIMED_REWARDS_PLACEMENT_ID,
    },
    nextFetchPolicy: 'network-only',
  });
  const [mutateRewardUser] = useAdsRewardPlacementMutation({
    variables: {
      placementId: TIMED_REWARDS_PLACEMENT_ID,
    },
  });

  const rarity = data?.placement?.reward.rarity;

  const listenToNotifications = useCallback(async () => {
    if (cancelNotificationListener.current) {
      cancelNotificationListener.current();
    }

    cancelNotificationListener.current = client.NotificationService.notifications({
      onPlacementStateUpdate: (_, ev) => {
        if (ev.state === PlacementState.PLACEMENT_STATE_NOT_READY) {
          setIsRewardReady(false);
        }

        if (ev.state === PlacementState.PLACEMENT_STATE_READY) {
          setIsRewardReady(true);
        }
      },
      onWalletTransaction: (_, ev) => {
        // Wallet transaction is not an ad watch
        if (!ev.transaction?.reason?.adWatched) {
          return;
        }

        // We do not care about the transaction that are not add operations
        const adWatchWalletRewards = ev.transaction?.operations?.filter(
          (operation) => operation.type === OperationType.TYPE_ADD,
        );

        if (!adWatchWalletRewards?.length) {
          setCustomErrorMessage('Failed to claim rewards, try again later.');
          return;
        }

        setReceivedWalletRewards(adWatchWalletRewards);
      },
    });

    client.NotificationService.resubscribe();
  }, [client]);

  useMountEffect(() => {
    Analytics.trackEvent({
      clientTimedAdsOpened: {
        placementId: TIMED_REWARDS_PLACEMENT_ID,
      },
    });

    listenToNotifications();

    const cancelFocusListener = navigation.addListener('focus', () => {
      listenToNotifications();
    });

    return () => {
      if (cancelNotificationListener.current) {
        cancelNotificationListener.current();
      }

      cancelFocusListener();
    };
  });

  const onRewardedVideoComplete = useCallback(async () => {
    MarketingTracking.trackEvent('rewarded_video_ad_watched');
    Analytics.trackEvent({
      clientTimedAdsRewardsClaimed: {
        placementId: TIMED_REWARDS_PLACEMENT_ID,
      },
    });

    InstrumentationAnalytics.addBreadcrumb({
      message: 'Rewarded video completed.',
      severityLevel: 'log',
    });

    try {
      // listener connection ends sometimes after app being background or locked for a while
      // we manually re-listen to these notifications to make sure we get the rewards
      listenToNotifications();

      await mutateRewardUser({
        variables: {
          placementId: TIMED_REWARDS_PLACEMENT_ID,
        },
      });
    } catch (err) {
      InstrumentationAnalytics.captureException(new Error(getErrorMessage(err)));
      setCustomErrorMessage('Failed to claim rewards, try again later.');
    }
  }, [listenToNotifications, mutateRewardUser]);

  const onRewardedVideoClose = useCallback(() => {
    Analytics.trackEvent({
      clientTimedAdsClosed: {
        placementId: TIMED_REWARDS_PLACEMENT_ID,
      },
    });
  }, []);

  const onRewardedVideoPlay = useCallback(() => {
    showRewardedVideo('Home_Screen', onRewardedVideoComplete, onRewardedVideoClose);

    Analytics.trackEvent({
      clientTimedAdsWatchingAd: {
        placementId: TIMED_REWARDS_PLACEMENT_ID,
      },
    });
  }, [onRewardedVideoClose, onRewardedVideoComplete, showRewardedVideo]);

  useEffect(() => {
    if (!receivedWalletRewards) {
      return;
    }

    navigation.replace('rewardedVideoRewarded', {
      returnRoute,
      receivedRewards: receivedWalletRewards,
      rewardRarity: data?.placement?.reward.rarity ?? RarityRarity.RarityCommon,
    });
  }, [navigation, receivedWalletRewards, data, returnRoute]);

  const updateReadyAtTime = useCallback(() => {
    if (!data?.placement?.reward.readyAt) {
      return '00:00';
    }

    const { readyAt: readyDateStr } = data.placement.reward;
    const readyAt = new Date(readyDateStr).getTime();
    const now = Date.now();
    const diff = readyAt - now;

    if (diff <= 0) {
      setIsRewardReady(true);
      return;
    }

    const dateStr = DateTime.fromMillis(diff).toFormat('mm:ss');
    setReadyInLabel(dateStr);
  }, [data]);

  useEffect(() => {
    if (!data?.placement?.reward.readyAt) {
      return;
    }

    const { readyAt: readyDateStr } = data.placement.reward;
    const readyAt = new Date(readyDateStr).getTime();
    const now = Date.now();
    const isReady = readyAt <= now;

    setIsRewardReady(isReady);

    let timer: number;
    if (!isReady) {
      updateReadyAtTime();
      timer = setInterval(updateReadyAtTime, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [data, updateReadyAtTime]);

  const footer = useMemo(() => {
    return (
      <PageLayout.Footer>
        <ButtonLarge
          analyticsActionName="WATCH_REWARD_AD"
          backgroundColor={['green500', 'teal500']}
          disabled={!rewardedVideoAvailable || !isRewardReady || !!rewardedVideoError}
          textColor="textDark"
          onPress={onRewardedVideoPlay}
        >
          {isRewardReady ? 'Watch ad to claim' : `Ready in ${readyInLabel}`}
        </ButtonLarge>
        {(!!rewardedVideoError || !!customErrorMessage) && (
          <>
            <Gutter height={16} />
            <Typography
              color="redMain"
              fontWeight="semiBold"
              textAlign="center"
            >
              {customErrorMessage
                ? customErrorMessage
                : 'Something went wrong, try again later.'}
            </Typography>
            {__DEV__ && (
              <Typography
                color="whiteTransparent60"
                textAlign="center"
              >
                {rewardedVideoError?.message}
              </Typography>
            )}
          </>
        )}
      </PageLayout.Footer>
    );
  }, [
    customErrorMessage,
    isRewardReady,
    onRewardedVideoPlay,
    readyInLabel,
    rewardedVideoAvailable,
    rewardedVideoError,
  ]);

  return (
    <PageLayout footer={footer}>
      <RewardedVideoRow
        rewardData={data?.placement}
        size={IS_SMALL_SCREEN ? 'small' : 'normal'}
      />
      <Gutter height={IS_SMALL_SCREEN ? 24 : 32} />
      <Typography
        color={rewardRarityLabelColor[rarity ?? RarityRarity.RarityCommon]}
        fontSize={IS_SMALL_SCREEN ? 'xl' : 'xxl'}
        fontWeight="medium"
        textAlign="center"
      >
        {rewardRarityLabel[rarity ?? RarityRarity.RarityCommon]} reward
      </Typography>

      <Gutter height={24} />
      <RewardContainsHint rewardHint={data?.placement} />
      <HStack justifyContent="center">
        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <RewardChest
            rarity={data?.placement?.reward.rarity}
            size={MAIN_REWARD_BOX_SIZE}
          />
        </Animated.View>
      </HStack>
    </PageLayout>
  );
}
