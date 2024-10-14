import { useClient } from '@noice-com/common-react-core';
import { getErrorMessage } from '@noice-com/utils';
import { StyleSheet } from 'react-native';
import Config from 'react-native-config';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';

import { colors } from '@constants/styles';
import { InstrumentationAnalytics } from '@lib/InstrumentationAnalytics';
import { openURL } from '@utils/open-url';

type HCaptchaResponseType = 'validated' | 'expired' | 'closed' | 'error';

interface HCaptchaResponse {
  type: HCaptchaResponseType;
  token?: string;
}

interface HCaptchaProps {
  onValidated: (token: string) => void;
  onError: (error?: string) => void;
  onClose?: () => void;
}

const HTML = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=320" />
    <title>Verify HCaptcha</title>
  </head>
  <script src="https://js.hcaptcha.com/1/api.js?hl=en&onload=onLoad" async defer></script>
    <script>
      function onValidated(token) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: "validated", token }));
      }
      function onClose() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: "closed" }));
      }
      function onError (err) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: "error" }));
      }
      function onLoad () {
        try {
          hcaptcha.render("captcha", {
            sitekey: "${Config.HCAPTCHA_SITE_KEY}",
            size: "invisible",
            callback: onValidated,
            "close-callback": onClose,
            "expired-callback": onError,
            "error-callback": onError
          });
        } catch (err) {
          onError(err);
        }
        hcaptcha.execute();
      }
    </script>
    <body>
      <div id="captcha"></div>
  </body>
</html>
`;

export const HCaptcha = ({ onError, onValidated, onClose }: HCaptchaProps) => {
  const client = useClient();

  const handleWebviewMessage = async (ev: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(ev.nativeEvent.data) as HCaptchaResponse;
      if (data.type === 'validated' && data.token) {
        const verifiedToken = await client.AuthService.verifyCaptcha(data.token);
        onValidated(verifiedToken);
      } else if (data.type === 'closed') {
        onClose?.();
      } else if (data.type === 'expired') {
        onError?.(data.type);
      } else if (data.type === 'error') {
        onError?.(data.type);
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      InstrumentationAnalytics.captureException(new Error(errorMessage));
      onError(errorMessage);
    }
  };

  const handleShouldStartLoadWithReq = (event: ShouldStartLoadRequest) => {
    if (event.url.slice(0, 24) === 'https://www.hcaptcha.com') {
      openURL(event.url);
      return false;
    }

    return true;
  };

  return (
    <WebView
      mixedContentMode="always"
      originWhitelist={['*']}
      source={{
        html: HTML,
        baseUrl: Config.NOICE_BASE_URL,
      }}
      style={s.webView}
      automaticallyAdjustContentInsets
      javaScriptEnabled
      onMessage={handleWebviewMessage}
      onShouldStartLoadWithRequest={handleShouldStartLoadWithReq}
    />
  );
};

const s = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: colors.transparent,
    overflow: 'visible',
    height: '100%',
    width: '100%',
  },
});
