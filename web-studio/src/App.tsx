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
  FeatureFlagProvider,
  ErrorBoundary,
  useClientLoadAnalytics,
} from '@noice-com/common-ui';
import { Client } from '@noice-com/platform-client';
import { ClientType } from '@noice-com/schemas/api/client.pb';
import { SocialPackageProvider } from '@noice-com/social';
import {
  StreamSettingsProvider,
  StreamAPIProvider,
  RenderQualityProfiles,
} from '@noice-com/stream';
import { makeLoggers, Nullable } from '@noice-com/utils';
import { sha256 } from 'crypto-hash';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Route, BrowserRouter, HashRouter, Routes } from 'react-router-dom';

import styles from './App.module.css';
import { AuthenticatedApp } from './AuthenticatedApp';
import { StudioAppLocalStorageKeys } from './common/local-storage/types';
import { AppErrorFallback } from './page/PageErrorFallback';
import { SettingsForwarder } from './pages/SettingsStream/SettingsForwarder/SettingsForwarder';

import faviconApple from '@assets/public/apple-touch-icon.png';
import favicon16 from '@assets/public/favicon-16x16.png';
import favicon32 from '@assets/public/favicon-32x32.png';
import favicon from '@assets/public/favicon.ico';
import {
  AvailableChannelsProvider,
  ChannelProvider,
  ChannelRouteProvider,
} from '@common/channel';
import { OnboardingProvider } from '@common/onboarding';
import { ProtectedRoute, Routes as AppRoutes } from '@common/route';
import { CameraDriveStateProvider, StreamProvider } from '@common/stream';
import { NoAccess, Login, Logout, NotFound, Suspended } from '@pages';

// eslint-disable-next-line @typescript-eslint/naming-convention
let ROUTING_BASE_NAME = process.env.BASE_PATH;

// eslint-disable-next-line
let ActiveRouter: any;

if (window.NOICE.HASH_ROUTING) {
  ActiveRouter = HashRouter;
  ROUTING_BASE_NAME = '/';
} else {
  ActiveRouter = BrowserRouter;
}

const soundController = new SoundController<StudioAppLocalStorageKeys>();
const client = new Client(
  NOICE.SERVICES_LIB_HOST,
  {
    useWSMuxer: true,
    forceWSStreaming: true,
  },
  NOICE.AUTH_BASE_URL,
  'studio',
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

const App = () => {
  const [localUserData, setLocalUserData] =
    useState<Nullable<LocalUserData<StudioAppLocalStorageKeys>>>(null);

  useMountEffect(() => {
    client.onAuthenticated((auth) => {
      if (!auth.uid) {
        logError('No UID in auth');
        return;
      }

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
  });

  useClientLoadAnalytics(client);

  return (
    <ErrorBoundary fallback={AppErrorFallback}>
      <AuthProvider
        client={client}
        loginRoute="/signin"
      >
        <ApolloProvider client={apolloClient}>
          <LocalUserDataProvider localUserData={localUserData}>
            <ClientProvider client={client}>
              <AnalyticProvider>
                <SoundControllerProvider soundController={soundController}>
                  <CameraDriveStateProvider>
                    <DndProvider backend={HTML5Backend}>
                      <SocialPackageProvider createProfileRoutePath={() => ''}>
                        <HelmetProvider>
                          <div className={styles.container}>
                            <Helmet titleTemplate="%s">
                              <title>Noice Studio</title>
                              <link
                                href={favicon}
                                rel="icon"
                              />
                              <link
                                href={faviconApple}
                                rel="apple-touch-icon"
                                sizes="180x180"
                              />
                              <link
                                href={favicon32}
                                rel="icon"
                                sizes="32x32"
                                type="image/png"
                              />
                              <link
                                href={favicon16}
                                rel="icon"
                                sizes="16x16"
                                type="image/png"
                              />
                            </Helmet>

                            <ActiveRouter basename={ROUTING_BASE_NAME}>
                              <Routes>
                                <Route
                                  element={<Login />}
                                  path={`${AppRoutes.LogIn}/*`}
                                />
                                <Route
                                  element={<Logout />}
                                  path={AppRoutes.LogOut}
                                />
                                {/** The (protected) pages with navigation layout */}
                                <Route
                                  element={
                                    <ProtectedRoute>
                                      <AvailableChannelsProvider>
                                        <Routes>
                                          <Route
                                            element={<NoAccess />}
                                            path={AppRoutes.NoAccess}
                                          />
                                          <Route
                                            element={<Suspended />}
                                            path={AppRoutes.Suspended}
                                          />
                                          <Route
                                            element={
                                              <FeatureFlagProvider>
                                                <StreamAPIProvider>
                                                  <StreamSettingsProvider>
                                                    <ChannelProvider>
                                                      <ChannelRouteProvider>
                                                        <StreamProvider>
                                                          <OnboardingProvider>
                                                            <AuthenticatedApp />
                                                          </OnboardingProvider>
                                                        </StreamProvider>
                                                      </ChannelRouteProvider>
                                                    </ChannelProvider>
                                                  </StreamSettingsProvider>
                                                </StreamAPIProvider>
                                              </FeatureFlagProvider>
                                            }
                                            path="/:channelName/*"
                                          />
                                          <Route
                                            element={<SettingsForwarder />}
                                            path={AppRoutes.StaticStreamSettings}
                                          />
                                          <Route
                                            element={<NotFound />}
                                            path="*"
                                          />
                                        </Routes>
                                      </AvailableChannelsProvider>
                                    </ProtectedRoute>
                                  }
                                  path="*"
                                />
                              </Routes>
                            </ActiveRouter>
                          </div>
                        </HelmetProvider>
                      </SocialPackageProvider>
                    </DndProvider>
                  </CameraDriveStateProvider>
                </SoundControllerProvider>
              </AnalyticProvider>
            </ClientProvider>
          </LocalUserDataProvider>
        </ApolloProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
