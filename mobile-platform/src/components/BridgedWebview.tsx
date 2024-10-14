import { color, spacing } from '@noice-com/design-tokens';
import { EventHandlers, WebBridge } from '@noice-com/webview-bridge';
import { BridgeWebView } from '@webview-bridge/react-native';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import {
  IOSWebViewProps,
  AndroidWebViewProps,
} from 'react-native-webview/lib/WebViewTypes';

import { HStack } from './Stack/HStack';
import { VStack } from './Stack/VStack';
import { Typography } from './Typography';

import { colors } from '@constants/styles';
import { useWebBridge, WEB_VIEW_BASE_URL, WebBridgeRef } from '@hooks/useWebBridge.hook';
import { INJECT_JS_ALL_MODIFICATIONS, webviewMetaData } from '@utils/webview';

// Factory for forwarding the existing ref so the actual component code
// remains clean.
const forwardRefFactory = (originalRef: BridgeWebView | null): BridgeWebView => ({
  goBack: (): void => {
    originalRef?.goBack();
  },
  goForward: (): void => {
    originalRef?.goForward();
  },
  reload: (): void => {
    originalRef?.reload();
  },
  stopLoading: (): void => {
    originalRef?.stopLoading();
  },
  injectJavaScript: (script: string): void => {
    originalRef?.injectJavaScript(script);
  },
  requestFocus: (): void => {
    originalRef?.requestFocus();
  },
  postMessage: (message: string): void => {
    originalRef?.postMessage(message);
  },
});

const defaultRenderError = (
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
        Error loading view
      </Typography>
      <Typography textAlign="center">
        We had an error loading the view. Please try again.
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

const defaultRenderLoading = () => (
  <View style={s.errorWrapper}>
    <Typography>Loading...</Typography>
  </View>
);

export type WebBridgeApiHandler = (webApi: WebBridgeRef | null) => () => void;

export type BridgedWebViewRef = BridgeWebView & {
  recreateBridgeInstance(): void;
};

type BaseWebviewProps = Omit<
  IOSWebViewProps & AndroidWebViewProps,
  'source' | 'injectedJavaScriptObject' | 'style'
>;

interface Props extends BaseWebviewProps {
  webviewSource: string;
  style?: StyleProp<ViewStyle>;
  apiHandlers?: Partial<EventHandlers>;
  devForceLocalHost?: boolean;
  onWebBridgeApi?: WebBridgeApiHandler;
  onWebViewPageLoaded?(loaded: boolean): void;
}

// @todo - We should figure out a better way to render the loading state.
// We have the renderLoading, but also the webViewPageIsLoaded -- we need
// to figure out which one we want to stick with and then update the API accordingly.
export const BridgedWebview = forwardRef<BridgedWebViewRef, Props>(
  (
    {
      webviewSource,
      injectedJavaScript,
      apiHandlers = {},
      devForceLocalHost = false,
      renderError = defaultRenderError,
      renderLoading = defaultRenderLoading,
      onWebBridgeApi,
      onWebViewPageLoaded,
      style,
      ...props
    },
    ref,
  ) => {
    const {
      WebViewWithBridge,
      linkWebMethod,
      webViewPageIsLoaded,
      recreateBridgeInstance,
    } = useWebBridge(apiHandlers);
    const [webviewRef, setWebviewRef] = useState<BridgeWebView | null>(null);

    useEffect(() => {
      onWebViewPageLoaded?.(webViewPageIsLoaded);
    }, [onWebViewPageLoaded, webViewPageIsLoaded]);

    useEffect(() => {
      if (!onWebBridgeApi) {
        return;
      }

      const webApi = linkWebMethod<WebBridge>?.();

      return onWebBridgeApi(webApi ?? null);
    }, [linkWebMethod, onWebBridgeApi]);

    useImperativeHandle(
      ref,
      () => {
        return {
          ...forwardRefFactory(webviewRef),
          recreateBridgeInstance,
        };
      },
      [webviewRef, recreateBridgeInstance],
    );

    if (!WebViewWithBridge) {
      return null;
    }

    const baseUrl = devForceLocalHost ? 'localhost:3000' : WEB_VIEW_BASE_URL;
    const jsToInject = `
      ${INJECT_JS_ALL_MODIFICATIONS}
      ${injectedJavaScript}
    `;
    const flattenedStyles = Array.isArray(style) ? StyleSheet.flatten(style) : style;

    return (
      <WebViewWithBridge
        injectedJavaScript={jsToInject}
        injectedJavaScriptObject={webviewMetaData}
        mediaPlaybackRequiresUserAction={false}
        ref={setWebviewRef}
        renderError={renderError}
        renderLoading={renderLoading}
        source={{
          uri: `${baseUrl}/${webviewSource}`,
        }}
        style={[s.webviewContainer, flattenedStyles]}
        webviewDebuggingEnabled={__DEV__}
        allowsInlineMediaPlayback
        {...props}
      />
    );
  },
);

const s = StyleSheet.create({
  webviewContainer: {
    width: '100%',
    flex: 1,
    height: '100%',
    backgroundColor: colors.transparent,
  },
  errorWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: color.blackMain,
  },
  errorContent: {
    paddingHorizontal: spacing.base,
  },
});
