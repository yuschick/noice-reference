import { gql } from '@apollo/client';
import { MediaStream } from '@livekit/react-native-webrtc';
import { color } from '@noice-com/design-tokens';
import { Nullable } from '@noice-com/utils';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { hasNotch } from 'react-native-device-info';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PillLabel } from '@components/PillLabel';
import { HStack } from '@components/Stack/HStack';
import { StreamVignette } from '@components/Stream/StreamVignette';
import { StreamPlayerActionOverlayFragment } from '@gen/graphql';
import { useHitSlop } from '@hooks/useHitSlop.hook';
import { useTimeDuration } from '@hooks/useTimeDuration.hook';
import { AuthenticatedNavigationHookProps } from '@navigators/routes';
import { formatLargeNumber } from '@utils/format';
import { IconAssets } from '@utils/icons';

interface Props {
  isLandscape?: boolean;
  onOrientationPressed?: () => void;
  onHide?: () => void;
  channelData?: StreamPlayerActionOverlayFragment;
  stream: Nullable<MediaStream>;
}

const ViewerIcon = (
  <IconAssets.Person
    color="white"
    height={16}
    width={16}
  />
);

const TimerIcon = (
  <IconAssets.Timer
    color="white"
    height={16}
    width={16}
  />
);

const OverlayButton = ({
  onPress,
  icon,
  ...rest
}: {
  icon: React.ReactNode;
} & TouchableOpacityProps) => {
  const [hitSlop, onLayout] = useHitSlop();

  return (
    <TouchableOpacity
      {...rest}
      hitSlop={hitSlop}
      onLayout={onLayout}
      onPress={onPress}
    >
      {icon}
    </TouchableOpacity>
  );
};

export const StreamPlayerActionsOverlay = ({
  onOrientationPressed,
  onHide,
  isLandscape,
  channelData,
}: Props) => {
  const formattedViewerCount = formatLargeNumber(channelData?.viewerCount ?? 0);
  const withNotch = hasNotch();
  const navigation = useNavigation<AuthenticatedNavigationHookProps>();
  const { top, bottom } = useSafeAreaInsets();
  const { days, hours, minutes, seconds, reset, stop, isRunning } = useTimeDuration({
    autoStart: false,
  });

  useEffect(() => {
    if (!channelData?.activeStream?.startTime) {
      stop();
      return;
    }

    reset(new Date(channelData?.activeStream?.startTime).getTime(), true);
  }, [channelData?.activeStream?.startTime, reset, stop]);

  const openSettings = () => {
    navigation.navigate('streamQuality');
  };

  const duration = `${days ? days + 'd ' : ''}${hours}:${
    minutes < 10 ? '0' : ''
  }${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const leftPadding = withNotch ? bottom : 16;
  const rightPadding = withNotch ? top : 16;

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={s.actionOverlay}
    >
      <StreamVignette style={s.vignette} />

      <OverlayButton
        icon={
          <IconAssets.Settings
            color={color.whiteMain}
            height={20}
            width={20}
          />
        }
        style={[s.settingsButton, isLandscape && { right: rightPadding }]}
        onPress={openSettings}
      />

      <OverlayButton
        accessibilityLabel="Toggle orientation"
        icon={<IconAssets.Fullscreen color={color.whiteMain} />}
        style={[s.fullScreenButton, isLandscape && { right: rightPadding }]}
        onPress={onOrientationPressed}
      />

      <OverlayButton
        icon={
          <IconAssets.Close
            color="white"
            height={20}
            style={s.hideIcon}
            width={20}
          />
        }
        style={[s.hideButton, isLandscape && { left: leftPadding }]}
        onPress={onHide}
      />

      <HStack
        alignItems="flex-start"
        justifyContent="space-between"
        style={[
          s.stats,
          isLandscape && s.landscapePadding,
          isLandscape && { paddingLeft: leftPadding, paddingRight: rightPadding },
        ]}
      >
        <HStack spacing={4}>
          <PillLabel
            color={['violetMain', 'magentaMain']}
            label="Live"
            uppercase
          />
          {isRunning && (
            <PillLabel
              color="black"
              icon={TimerIcon}
              label={duration}
            />
          )}
          <PillLabel
            color="black"
            icon={ViewerIcon}
            label={formattedViewerCount}
          />
        </HStack>
      </HStack>
    </Animated.View>
  );
};

StreamPlayerActionsOverlay.fragment = gql`
  fragment StreamPlayerActionOverlay on ChannelChannel {
    viewerCount
    activeStream {
      startTime
      streamId
    }
  }
`;

const s = StyleSheet.create({
  actionOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
  },
  hideButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    width: 'auto',
    flexGrow: 0,
    flex: 1,
  },
  hideIcon: {
    transform: [{ rotate: '90deg' }],
  },
  settingsButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  fullScreenButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  stats: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  landscapePadding: {
    bottom: 16,
  },
});
