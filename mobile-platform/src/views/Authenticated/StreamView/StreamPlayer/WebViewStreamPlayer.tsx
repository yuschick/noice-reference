import { color, spacing } from '@noice-com/design-tokens';
import { QualityLayer } from '@noice-com/schemas/stream/egress.pb';
import { EventHandlers } from '@noice-com/webview-bridge';
import { useCallback, useMemo, useRef } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { BridgedWebview, WebBridgeApiHandler } from '@components/BridgedWebview';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { useWebviewStreamStore } from '@hooks/useWebviewStream.hook';

const renderError = (
  errorDomain: string | undefined,
  errorCode: number,
  errorDesc: string,
) => (
  <HStack
    alignItems="center"
    justifyContent="center"
    style={s.errorWrapper}
  >
    <VStack
      alignItems="center"
      justifyContent="center"
      style={s.errorContent}
    >
      <Typography
        fontWeight="bold"
        textAlign="center"
      >
        Error loading stream
      </Typography>
      <Typography textAlign="center">
        We had an error loading the stream. Please try again.
      </Typography>
      <Typography
        fontSize="xs"
        textAlign="center"
      >
        {!!errorDomain && `${errorDomain}: `}
        {errorDesc} (code: {errorCode})
      </Typography>
    </VStack>
  </HStack>
);

interface Props {
  streamId: string;
  style?: StyleProp<ViewStyle>;

  onSingleTap: () => void;
  onDoubleTap: () => void;
}

export function WebViewStreamPlayer({
  streamId,
  style,
  onSingleTap,
  onDoubleTap,
}: Props) {
  const { handleQualityUpdate, setActiveApi, reset } = useWebviewStreamStore();
  const lastTap = useRef<number>(0);
  const tapTimer = useRef<number>(0);

  const bridgeHandlers = useMemo<Partial<EventHandlers>>(() => {
    return {
      onVideoStreamQualityChange: (
        activeQuality: QualityLayer | null,
        available: QualityLayer[],
      ): Promise<void> => {
        handleQualityUpdate(activeQuality, available);
        return Promise.resolve();
      },
      onEmbedReady: (): Promise<void> => {
        return Promise.resolve();
      },
    };
  }, [handleQualityUpdate]);

  const handleWebBridgeApi: WebBridgeApiHandler = useCallback(
    (webApi) => {
      setActiveApi(webApi);

      return () => {
        reset();
      };
    },
    [reset, setActiveApi],
  );

  const handleTouchStart = () => {
    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
    }
  };

  const handleTouchEnd = () => {
    const now = Date.now();
    const doubleTabDelay = 300;

    if (lastTap.current && now - lastTap.current < doubleTabDelay) {
      onDoubleTap();
    } else {
      tapTimer.current = setTimeout(() => {
        onSingleTap();
      }, doubleTabDelay);
    }

    lastTap.current = now;
  };

  return (
    <BridgedWebview
      apiHandlers={bridgeHandlers}
      bounces={false}
      renderError={renderError}
      scrollEnabled={false}
      style={style}
      webviewSource={`embed/stream/${streamId}`}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onWebBridgeApi={handleWebBridgeApi}
    />
  );
}

const s = StyleSheet.create({
  errorWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: color.blackMain,
  },
  errorContent: {
    paddingHorizontal: spacing.base,
  },
});
