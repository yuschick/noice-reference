import { gql } from '@apollo/client';
import { RTCView } from '@livekit/react-native-webrtc';
import { useBooleanFeatureFlag } from '@noice-com/common-react-core';
import { useCallback, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { useWatchStream } from './hooks/useWatchStream.hook';
import { StreamPlayerActionsOverlay } from './StreamPlayerActionsOverlay';
import { WebViewStreamPlayer } from './WebViewStreamPlayer';

import { StreamPlayerFragment } from '@gen/graphql';
import { useActiveMediaStream } from '@hooks/useStreamStore.hook';

interface Props {
  streamId: string;
  showStreamActions?: boolean;
  channelData?: StreamPlayerFragment;
  isLandscape?: boolean;
  onPressStreamWindow?: () => void;
  onHideStream?: () => void;
  onForceOrientationChange?: () => void;
  style?: StyleProp<ViewStyle>;
}

StreamPlayer.fragment = gql`
  fragment StreamPlayer on ChannelChannel {
    ...StreamPlayerActionOverlay
  }

  ${StreamPlayerActionsOverlay.fragment}
`;

export function StreamPlayer({
  streamId,
  channelData,
  showStreamActions,
  isLandscape,
  onHideStream,
  onPressStreamWindow,
  onForceOrientationChange,
  style,
}: Props) {
  const [useWebviewStream, isWebviewTypeLoading] = useBooleanFeatureFlag(
    'mobile_webviewStreamPlayer',
    true,
  );

  const mediaStream = useActiveMediaStream();
  useWatchStream(streamId, !isWebviewTypeLoading && !useWebviewStream);

  const handleSingleTap = useCallback(() => {
    onPressStreamWindow?.();
  }, [onPressStreamWindow]);

  const handleDoubleTap = useCallback(() => {
    // TODO: remimplement double tap to fullscreen
  }, []);

  const onSingleTap = Gesture.Tap().numberOfTaps(1).onEnd(handleSingleTap).runOnJS(true);
  const onDoubleTap = Gesture.Tap().numberOfTaps(2).onEnd(handleDoubleTap).runOnJS(true);

  const streamPlayerComponent = useMemo(() => {
    if (isWebviewTypeLoading) {
      return null;
    }

    if (useWebviewStream) {
      return (
        <WebViewStreamPlayer
          streamId={streamId}
          style={style}
          onDoubleTap={handleDoubleTap}
          onSingleTap={handleSingleTap}
        />
      );
    }

    return (
      mediaStream && (
        <RTCView
          streamURL={mediaStream?.toURL()}
          style={style}
        />
      )
    );
  }, [
    isWebviewTypeLoading,
    useWebviewStream,
    mediaStream,
    style,
    streamId,
    handleDoubleTap,
    handleSingleTap,
  ]);

  return (
    <GestureDetector gesture={Gesture.Exclusive(onDoubleTap, onSingleTap)}>
      <View style={style}>
        {streamPlayerComponent}
        {showStreamActions && (
          <StreamPlayerActionsOverlay
            channelData={channelData}
            isLandscape={isLandscape}
            stream={mediaStream}
            onHide={onHideStream}
            onOrientationPressed={onForceOrientationChange}
          />
        )}
      </View>
    </GestureDetector>
  );
}
