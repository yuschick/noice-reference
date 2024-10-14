import { useConditionalOnce, useMountEffect } from '@noice-com/common-react-core';
import {
  AnyConversionEvent,
  ConversionEventsProvider,
  FeatureFlagProvider as RemoteFeatureFlagProvider,
  useInitWalletAndListenWalletUpdates,
} from '@noice-com/common-ui';
import { blockedWebRoutesList, NativeBridge } from '@noice-com/webview-bridge';
import { useCallback, useMemo, useState } from 'react';
import { Route, Routes } from 'react-router';

import { getBridge, isReactNativeWebView } from '../bridge';
import { CollectionEmbed } from '../CollectionEmbed';
import { GameEmbed } from '../GameEmbed';
import { SeasonsEmbed } from '../SeasonsEmbed';
import { StoreEmbed } from '../StoreEmbed';
import { StoreItemEmbed } from '../StoreItemEmbed/StoreItemEmbed';
import { StreamEmbed } from '../StreamEmbed';

import { EnvironmentCheckProvider } from '@common/environment';
import { AuthenticatedRoute } from '@common/route';

interface Props {
  loadingUserData: boolean;
}

type AuthenticatedEmbedProps = {
  bridge: NativeBridge | null;
};

function AuthenticatedEmbed({ bridge }: AuthenticatedEmbedProps) {
  useInitWalletAndListenWalletUpdates();

  // We don't use gtag to send data layer events in the embedded view
  const emptyDataLayer: Record<string, unknown>[] = useMemo(() => [], []);

  const onEventSent = useCallback(
    async (event: AnyConversionEvent) => {
      if (!bridge) {
        return;
      }

      bridge.onConversionEvent(event);
    },
    [bridge],
  );

  return (
    <EnvironmentCheckProvider>
      <RemoteFeatureFlagProvider>
        <ConversionEventsProvider
          dataLayer={emptyDataLayer}
          onEventSent={onEventSent}
        >
          <Routes>
            <Route
              element={<GameEmbed />}
              path={'game/:streamId'}
            />
            <Route
              element={<StreamEmbed />}
              path={'stream/:streamId'}
            />
            <Route
              element={<StoreEmbed />}
              path={'store'}
            />
            <Route
              element={<StoreEmbed />}
              path="store/:gameCreators"
            />
            <Route
              element={<StoreItemEmbed />}
              path="store/:gameCreators/:storeItemId"
            />
            <Route path="collection">
              <Route
                element={<CollectionEmbed />}
                index
              />
              <Route
                element={<CollectionEmbed />}
                path=":gameCreators"
              />
              <Route
                element={<CollectionEmbed />}
                path=":gameCreators/:seasonId"
              />
              <Route
                element={<CollectionEmbed />}
                path=":gameCreators/:seasonId/:itemId"
              />
            </Route>
            <Route
              element={<SeasonsEmbed />}
              path={'seasons'}
            />
          </Routes>
        </ConversionEventsProvider>
      </RemoteFeatureFlagProvider>
    </EnvironmentCheckProvider>
  );
}

export function Embed({ loadingUserData }: Props) {
  const [bridge, setBridge] = useState<NativeBridge | null>(null);

  useConditionalOnce(() => {
    const handleReady = async () => {
      const { bridge } = await getBridge();
      setBridge(bridge);
      bridge.onEmbedReady();
    };

    if (isReactNativeWebView()) {
      handleReady();
    }
  }, !loadingUserData);

  useMountEffect(() => {
    let bridge: NativeBridge | null = null;

    const handleReady = async () => {
      // awaiting the bridge to be ready inside causes double click issue on some links
      const { bridge: bridgeInstance } = await getBridge();
      bridge = bridgeInstance;
      setBridge(bridgeInstance);
    };

    if (isReactNativeWebView()) {
      handleReady();
    }

    // a bit of a hack but will suffice now as we are prototyping stuff
    // make body background transparent
    document.body.style.backgroundColor = 'transparent';
    document.body.style.backgroundImage = 'none';

    const windowPushState = window.history.pushState;
    window.history.pushState = function () {
      // eslint-disable-next-line prefer-rest-params
      const currentRoute = arguments[2];

      if (!currentRoute.startsWith('/embed')) {
        for (const blockedRoute of blockedWebRoutesList) {
          const isBlocked = blockedRoute.test(currentRoute);
          if (isBlocked) {
            bridge?.onNavigate(currentRoute);
            return;
          }
        }
      }

      // @ts-ignore
      // eslint-disable-next-line prefer-rest-params
      windowPushState.apply(this, arguments);
    };
  });

  if (loadingUserData) {
    return null;
  }

  return (
    <AuthenticatedRoute>
      <AuthenticatedEmbed bridge={bridge} />
    </AuthenticatedRoute>
  );
}
