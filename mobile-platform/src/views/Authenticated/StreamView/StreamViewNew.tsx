import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useClient } from '@noice-com/common-react-core';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  ReduceMotion,
  SensorType,
  useAnimatedSensor,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAutoHideIndicator } from './hooks/useAutoHideIndicator.hook';
import { MatureContentWarning } from './MatureContentWarning';
import { StreamChatRef } from './StreamChat/StreamChat';
import { StreamChatWrapper } from './StreamChat/StreamChatWrapper';
import { StreamGame } from './StreamGame/StreamGame';
import { StreamInfo } from './StreamInfo/StreamInfo';
import { StreamPlayer } from './StreamPlayer/StreamPlayer';
import { StreamViewLoading } from './StreamViewLoading';

import {
  PageContentWithTabs,
  TabWithContent,
} from '@components/PageContentWithTabs/PageContentWithTabs';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { ChannelLiveStatus, useStreamViewChannelQueryQuery } from '@gen/graphql';
import { useAskToEnableNotifications } from '@hooks/notifications/useAskToEnableNotifications.hook';
import { useShowContentWarning } from '@hooks/privacy/useShowMatureContentWarning.hook';
import { useChannelSubscription } from '@hooks/useChannelSubscription.hook';
import { useKeyboard } from '@hooks/useKeyboard.hook';
import { useMountEffect } from '@hooks/useMountEffect.hook';
import { useViewerCountSubscription } from '@hooks/useViewerCountSubscription.hook';
import { MarketingTracking } from '@lib/MarketingTracking';
import { NoiceStreamViewOrientation } from '@native/components/NativeNoiceStreamView';
import { NoiceStreamView } from '@native/components/NoiceStreamView';
import { AuthenticatedScreenProps } from '@navigators/routes';
import { getChannelIsGamePredictionsEnabled } from '@utils/game';
import { IconAssets } from '@utils/icons';
import { ImageAssets } from '@utils/image';

gql`
  query StreamViewChannelQuery($channelId: ID!) {
    channel(id: $channelId) {
      id
      currentChatId
      followerCount
      matureRatedContent
      userBanStatus {
        banned
      }
      streamer {
        userId
      }
      ...StreamInfoChannel
      ...StreamPlayer
    }
  }

  ${StreamInfo.fragments.channel}
  ${StreamPlayer.fragment}
`;

const DEFAULT_HIDE_ACTIONS_DELAY = 3000;

export const StreamViewNew = ({
  route: {
    params: { streamId, channelId, liveStatus = ChannelLiveStatus.LiveStatusUnspecified },
  },
  navigation,
}: AuthenticatedScreenProps<'stream'>) => {
  const { showMatureContentWarning, loading: loadingUserContentWarningPreference } =
    useShowContentWarning();
  const [overrideMatureContent, setShowOverrideMatureContent] = useState<boolean>(false);
  const [showStreamActions, setShowStreamActions] = useState<boolean>(true);
  const hideActionsTimeout = useRef<number>();
  const streamChatRef = useRef<StreamChatRef>();
  const client = useClient();
  const insets = useSafeAreaInsets();
  const { isKeyboardVisible } = useKeyboard();
  const [forcedOrientation, setForcedOrientation] =
    useState<NoiceStreamViewOrientation>();

  const { liveStatus: updatedLiveStatus } = useChannelSubscription({ channelId });
  const rotation = useAnimatedSensor(SensorType.ROTATION, {
    interval: 20,
  });
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [streamViewSize, setStreamViewSize] = useState({
    width: Dimensions.get('window').width, // Estimated
    height: Dimensions.get('window').height * (9 / 16), // Estimated
  });
  const [contentSize, setContentSize] = useState({
    width: Dimensions.get('window').width, // Estimated
    height:
      Dimensions.get('window').height -
      insets.top -
      Dimensions.get('window').height * (9 / 16), // Estimated
  });

  const isLandscape = streamViewSize.width > Dimensions.get('screen').width;

  useAutoHideIndicator();
  useAskToEnableNotifications(channelId);
  useViewerCountSubscription(channelId);

  useMountEffect(() => {
    MarketingTracking.trackEvent('stream_open');
    autoHideActions();

    const keyboardSub = Keyboard.addListener('keyboardWillShow', () => {
      setShowStreamActions(false);
    });

    client.NotificationService.notifications({
      onChannelUserBanned: (_, ev) => {
        if (ev.channelId === channelId) {
          navigation.replace('channelUserBan', {
            channelId,
          });
        }
      },
    });

    return () => {
      if (hideActionsTimeout.current) {
        clearTimeout(hideActionsTimeout.current);
      }

      if (keyboardSub) {
        keyboardSub.remove();
      }
    };
  });

  const autoHideActions = () => {
    if (hideActionsTimeout.current) {
      clearTimeout(hideActionsTimeout.current);
    }

    hideActionsTimeout.current = setTimeout(() => {
      setShowStreamActions(false);
    }, DEFAULT_HIDE_ACTIONS_DELAY);
  };

  const onShowStreamActions = () => {
    if (showStreamActions) {
      setShowStreamActions(false);
      return;
    }

    setShowStreamActions(true);
    Keyboard.dismiss();
    streamChatRef.current?.hideExtraViews();
    autoHideActions();
  };

  const {
    data: { channel } = {},
    loading,
    refetch,
    error,
  } = useStreamViewChannelQueryQuery({
    ...variablesOrSkip({ channelId }),
  });

  // Check if stream is offline and redirect
  useEffect(() => {
    if (updatedLiveStatus !== ChannelLiveStatus.LiveStatusOffline) {
      return;
    }

    if (channel?.name) {
      navigation.navigate('channel', {
        channelName: channel.name,
      });
      return;
    }

    navigation.navigate('home');
  }, [channel, navigation, updatedLiveStatus]);

  useEffect(() => {
    // redirect user if banned on open
    if (channel?.userBanStatus.banned) {
      navigation.replace('channelUserBan', { channelId });
    }
  }, [channel?.userBanStatus.banned, channelId, navigation]);

  // when navigating back from subscription modal, we want to refetch the channel data
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const backgroundStyle = useAnimatedStyle(() => {
    const { qx, qy } = rotation.sensor.value;

    return {
      transform: [
        {
          translateX: withSpring(qy * 100, {
            damping: 200,
            reduceMotion: ReduceMotion.System,
          }),
        },
        {
          translateY: withSpring(qx * 50, {
            damping: 200,
            reduceMotion: ReduceMotion.System,
          }),
        },
      ],
    };
  });

  const onSubscribe = () => {
    if (!channelId) {
      return;
    }

    navigation.navigate('subscribeToChannel', {
      channelId,
    });
  };

  const onManageSubscription = () => {
    navigation.navigate('manageSubscription', {
      channelId,
    });
  };

  const onChannelOptions = () => {
    if (!channelId || !channel?.streamer?.userId) {
      return;
    }

    navigation.navigate('channelOptionsModal', {
      channelId,
      streamId,
      userId: channel?.streamer.userId,
    });
  };

  const navigateBack = () => {
    navigation.pop();
  };

  const onForceOrientationChange = () => {
    // stream overlay vignette looks funny when changing orientation so hide it before rotating
    setShowStreamActions(false);

    setForcedOrientation(() => {
      if (isLandscape) {
        return 'portrait';
      } else {
        return 'landscape';
      }
    });
  };

  const gamePredictionsEnabled = getChannelIsGamePredictionsEnabled(channel);

  const tabs: TabWithContent[] = useMemo(
    () => [
      ...(gamePredictionsEnabled
        ? [
            {
              index: 0,
              name: 'game',
              icon: (
                <IconAssets.Card
                  fill={colors.white}
                  height={24}
                  width={24}
                />
              ),
              component: <StreamGame streamId={streamId} />,
            },
          ]
        : []),
      {
        index: 1,
        name: 'chat',
        icon: (
          <IconAssets.Chat
            fill={colors.white}
            height={24}
            width={24}
          />
        ),
        component: !!channel?.currentChatId && (
          <StreamChatWrapper
            channelId={channelId}
            channelName={channel?.name}
            chatId={channel?.currentChatId}
            ref={streamChatRef}
          />
        ),
      },
    ],
    [channel?.currentChatId, channel?.name, channelId, gamePredictionsEnabled, streamId],
  );

  const tabContentBackground = (
    <Animated.Image
      source={ImageAssets.arenaBackground}
      style={[
        backgroundStyle,
        s.background,
        {
          left: windowWidth * -0.2,
          top: windowHeight * -0.1,
          width: windowWidth * 1.4,
          height: windowHeight * 1.2,
        },
      ]}
    />
  );

  const isLoadingView = !channel || loading || loadingUserContentWarningPreference;
  const isMatureContentWarningVisible =
    showMatureContentWarning && channel?.matureRatedContent && !overrideMatureContent;

  return (
    <NoiceStreamView
      forcedOrientation={forcedOrientation}
      showOverlay={isLoadingView || isMatureContentWarningVisible || !!error}
      style={s.flex}
      onContentLayoutChanged={(layoutInfo) => setContentSize(layoutInfo.nativeEvent)}
      onHeaderLayoutChanged={(layoutInfo) => setStreamViewSize(layoutInfo.nativeEvent)}
    >
      <NoiceStreamView.Header>
        {liveStatus === ChannelLiveStatus.LiveStatusLive && channel && (
          <StreamPlayer
            channelData={channel}
            isLandscape={isLandscape}
            showStreamActions={showStreamActions}
            streamId={streamId}
            style={{
              width: streamViewSize.width,
              height: streamViewSize.height,
            }}
            onForceOrientationChange={onForceOrientationChange}
            onHideStream={navigateBack}
            onPressStreamWindow={onShowStreamActions}
          />
        )}
      </NoiceStreamView.Header>
      <NoiceStreamView.Content>
        <PageContentWithTabs
          contentBackground={tabContentBackground}
          contentSize={contentSize}
          disableHorizontalScroll={isKeyboardVisible}
          initialTabIndex={1}
          tabs={tabs}
          hideTabNames
        />
        {showStreamActions && channel && (
          <View style={[s.infoContainer, { width: contentSize.width }]}>
            <StreamInfo
              channelData={channel}
              channelId={channelId}
              onChannelOptions={onChannelOptions}
              onManageSubscription={onManageSubscription}
              onSubscribe={onSubscribe}
            />
          </View>
        )}
      </NoiceStreamView.Content>
      <NoiceStreamView.Overlay>
        <Animated.View
          entering={FadeIn.delay(300)}
          style={[
            s.center,
            {
              width: contentSize.width,
              height: contentSize.height + streamViewSize.height + insets.top,
            },
          ]}
        >
          {error && (
            <Typography
              color="textLight"
              fontSize="lg"
              fontWeight="semiBold"
              lineHeight="lg"
            >
              There was an error
            </Typography>
          )}
          {!error && isLoadingView && <StreamViewLoading />}
          {!error && !isLoadingView && isMatureContentWarningVisible && (
            <MatureContentWarning
              onHandleStartStream={() => setShowOverrideMatureContent(true)}
            />
          )}
        </Animated.View>
      </NoiceStreamView.Overlay>
    </NoiceStreamView>
  );
};

const s = StyleSheet.create({
  flex: {
    flex: 1,
  },
  infoContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
});
