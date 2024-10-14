import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from '@noice-com/apollo-client-utils';
import { ClientProvider, useMountEffect } from '@noice-com/common-react-core';
import {
  LocalUserDataProvider,
  SoundController,
  SoundControllerProvider,
  AuthProvider,
  LocalUserData,
  monkeyPatchAnalytics,
  AnalyticProvider,
} from '@noice-com/common-ui';
import { Client } from '@noice-com/platform-client';
import { ClientType } from '@noice-com/schemas/api/client.pb';
import { RenderQualityProfiles } from '@noice-com/stream';
import { makeLoggers, Nullable } from '@noice-com/utils';
import * as Sentry from '@sentry/react';
import { sha256 } from 'crypto-hash';
import { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import { BrowserSourceRoute } from '@common/browser-sources/BrowserSourceRoute';
import { StudioAppLocalStorageKeys } from '@common/local-storage';
import { SignInRoute } from '@common/popout/SignIn/SignInRoute';
import { WaitForLogin } from '@common/popout/WaitForLogin/WaitForLogin';
import { Routes as AppRoutes } from '@common/route';
import { StreamAlertsRoute } from '@common/stream-alerts/StreamAlertsRoute';
import { WidgetRoute } from '@common/widget/WidgetRoute';

const soundController = new SoundController<StudioAppLocalStorageKeys>();
const client = new Client(
  NOICE.SERVICES_LIB_HOST,
  {
    useWSMuxer: true,
  },
  NOICE.AUTH_BASE_URL,
);

/**
 * @todo find a new home for this function. This is abstracted platform
 * specific functionality from the create apollo client to make it usable
 * by all clients independent of platform. Note that a copy of this function
 * exists in all web clients.
 */
const customLinkConnectionRetryWait = (retries: number) => {
  // When online, retry after 2, 4, 8, 16, 32, 64.... seconds
  if (navigator.onLine) {
    const time = Math.min(Math.pow(2, retries), 64) * 100;

    return new Promise<void>((resolve) => setTimeout(resolve, time));
  }

  // When offline, wait for the user to come back online
  return new Promise<void>((resolve) => {
    const onlineListener = () => {
      window.removeEventListener('online', onlineListener);
      resolve();
    };

    window.addEventListener('online', onlineListener);
  });
};

const apolloClient = createApolloClient({
  client,
  httpLinkUrl: `${window.NOICE.SERVICES_LIB_HOST}/query`,
  wsLinkUrl: `${window.NOICE.SERVICES_LIB_WEBSOCKET}/query`,
  enableApolloDevTools: window.NOICE.USE_APOLLO_DEV_TOOLS,
  customLinkConnectionRetryWait,
  sha256,
});

monkeyPatchAnalytics(client, ClientType.CLIENT_TYPE_STUDIO_WEB);

const { logError } = makeLoggers('APP');

export const PopoutApp = () => {
  const [localUserData, setLocalUserData] =
    useState<Nullable<LocalUserData<StudioAppLocalStorageKeys>>>(null);

  useMountEffect(() => {
    client.onAuthenticated((auth) => {
      if (!auth.uid) {
        logError('No UID in auth');
        return;
      }

      Sentry.setUser({ id: auth.uid });

      const userData = new LocalUserData<StudioAppLocalStorageKeys>(
        {
          'audio.volume.master': 1,
          'audio.volume.effects': 1,
          'audio.volume.stream': 1,
          'audio.muted': true,
          'channel.selected': null,
          'channel.recentlyVisited': null,
          'renderSettings.performanceProfileIndex': 1,
          'renderSettings.performanceProfile': RenderQualityProfiles[1].settings,
          'renderSettings.metricsVisible': false,
          'streamSettings.preferredQuality': null,
          'announcements.seen': [],
        },
        auth.uid,
      );

      soundController.localUserData = userData;
      setLocalUserData(userData);
    });

    return () => {
      Sentry.setUser(null);
    };
  });

  return (
    <AuthProvider
      client={client}
      loginRoute={AppRoutes.PopoutSignin}
      redirect={false}
    >
      <ApolloProvider client={apolloClient}>
        <LocalUserDataProvider localUserData={localUserData}>
          <ClientProvider client={client}>
            <AnalyticProvider>
              <SoundControllerProvider soundController={soundController}>
                <HelmetProvider>
                  <Helmet titleTemplate="%s | Noice Studio">
                    <title>Popout</title>
                  </Helmet>

                  <BrowserRouter>
                    <Routes>
                      <Route
                        element={<SignInRoute />}
                        path={`${AppRoutes.PopoutSignin}/*`}
                      />
                      <Route
                        element={<WaitForLogin />}
                        path={AppRoutes.PopoutWaitForLogin}
                      />
                      <Route
                        element={
                          <Routes>
                            <Route
                              element={<BrowserSourceRoute />}
                              path={`${AppRoutes.BrowserSource}/:browserSourceId`}
                            />
                            <Route
                              element={<StreamAlertsRoute />}
                              path={`${AppRoutes.StreamAlerts}/:alertType`}
                            />
                            <Route
                              element={<WidgetRoute />}
                              path="/:widgetId"
                            />
                          </Routes>
                        }
                        path={`${AppRoutes.Popout}/*`}
                      />
                    </Routes>
                  </BrowserRouter>
                </HelmetProvider>
              </SoundControllerProvider>
            </AnalyticProvider>
          </ClientProvider>
        </LocalUserDataProvider>
      </ApolloProvider>
    </AuthProvider>
  );
};
