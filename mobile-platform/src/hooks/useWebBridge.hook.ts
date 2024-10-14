import { useClient } from '@noice-com/common-react-core';
import { Client } from '@noice-com/platform-client';
import { makeLoggers } from '@noice-com/utils';
import { EventHandlers, NativeBridge, WebBridge } from '@noice-com/webview-bridge';
import { useNavigation } from '@react-navigation/native';
import { bridge, createWebView, WebMethod } from '@webview-bridge/react-native';
import { useCallback, useMemo, useRef, useState } from 'react';
import Config from 'react-native-config';

import { MarketingTracking } from '@lib/MarketingTracking';
import { AuthenticatedNavigationHookProps } from '@navigators/routes';

const { logInfo } = makeLoggers('WebBridge');

export type WebBridgeRef = {
  current: WebMethod<WebBridge>;
};

export const WEB_VIEW_BASE_URL = __DEV__
  ? 'http://localhost:3000'
  : Config.NOICE_BASE_URL;

const createBridge = (client: Client, eventHandlers: EventHandlers) => {
  const newAppBridge = bridge<NativeBridge>({
    refreshAccessToken: async () => {
      await client.refreshAccessToken();
      const session = client.getSession();

      return session.auth;
    },
    getSession: async () => {
      return client.getSession();
    },
    ...eventHandlers,
    // @ts-ignore
    toJSON: (data) => {
      return JSON.stringify(data);
    },
    // @ts-ignore
    then: (data) => {
      return data;
    },
  });

  const { WebView: webViewWithBridge, linkWebMethod } = createWebView({
    bridge: newAppBridge,
    debug: __DEV__,
    responseTimeout: 5000,
  });

  return {
    webViewWithBridge,
    linkWebMethod,
  };
};

export const useWebBridge = (handlers: Partial<EventHandlers> = {}) => {
  const client = useClient();
  const { canGoBack, navigate, goBack } =
    useNavigation<AuthenticatedNavigationHookProps>();
  const [webViewPageIsLoaded, setWebViewPageIsLoaded] = useState(false);
  const [recreateBridge, forceRecreateBridge] = useState(Date.now());
  const handlerRef = useRef<Partial<EventHandlers>>(handlers);
  handlerRef.current = handlers;

  const recreateBridgeInstance = useCallback(() => {
    forceRecreateBridge(Date.now());
    setWebViewPageIsLoaded(false);
  }, []);

  const bridged = useMemo(() => {
    if (!client) {
      return;
    }
    logInfo('Creating a new bridge instance.');

    const { linkWebMethod, webViewWithBridge } = createBridge(client, {
      onEmbedReady: (): Promise<void> => {
        logInfo('OnEmbedReady');
        handlerRef.current.onEmbedReady?.();
        return Promise.resolve();
      },
      onPageLoaded: (): Promise<void> => {
        logInfo('OnPageLoaded');
        setWebViewPageIsLoaded(true);
        handlerRef.current.onPageLoaded?.();
        return Promise.resolve();
      },
      onNavigate: (url: string): Promise<void> => {
        logInfo('OnNavigate: ', url);

        // @todo: When we have know all the captured routes we need
        // Then we can re-evaluate how to handle the logic, inline is fine for now.
        if (url === '/browse' || url === '/') {
          while (canGoBack()) {
            goBack();
          }

          navigate('homeTab', { screen: 'home' });
        }

        if (url.includes('/store/')) {
          navigate('storeItem', { itemUrl: url });
        }

        handlerRef.current.onNavigate?.(url);
        return Promise.resolve();
      },
      onVideoStreamQualityChange: (currentQuality, available) => {
        handlerRef.current.onVideoStreamQualityChange?.(currentQuality, available);
        return Promise.resolve();
      },
      onConversionEvent: (event) => {
        logInfo('OnConversionEvent: ', event);

        if (event.event === 'GameCardPicked') {
          MarketingTracking.trackEvent('game_card_picked', {
            contentId: event.contentId,
          });
        }

        if (event.event === 'GameCardScored') {
          MarketingTracking.trackEvent('game_card_scored', {
            pointsTotal: event.pointsTotal,
          });
        }

        if (event.event === 'GameFinishedMatch') {
          MarketingTracking.trackEvent('game_finished_a_match');
        }

        if (event.event === 'CardPackPurchased') {
          MarketingTracking.trackEvent('purchased_card_pack', {
            contentId: event.contentId,
            currencyId: event.currencyId,
          });
        }

        return Promise.resolve();
      },
    });

    return { linkWebMethod, webViewWithBridge };
    // We need to disable because we need to allow for force re-creation of the bridge
    // this needs to be done when doing a full page reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canGoBack, client, goBack, navigate, recreateBridge]);

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    WebViewWithBridge: bridged?.webViewWithBridge,
    linkWebMethod: bridged?.linkWebMethod,
    webViewPageIsLoaded,
    recreateBridgeInstance,
  };
};
