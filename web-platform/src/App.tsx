import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from '@noice-com/apollo-client-utils';
import { ClientProvider } from '@noice-com/common-react-core';
import {
  LocalUserDataProvider,
  LocalUserData,
  UIEventHandlerProvider,
  UIEventsHandler,
  SoundController,
  SoundControllerProvider,
  AuthProvider,
  monkeyPatchAnalytics,
  ErrorBoundary,
  FTUEActionHandlerProvider,
  FTUEActionsHandler,
  SessionStorageProvider,
  AnalyticProvider,
  FullscreenSpinner,
  TitleAnnouncer,
  useClientLoadAnalytics,
  ConversionEventsProvider,
  KeyContentLoadTrackerProvider,
  FeatureFlagProvider as RemoteFeatureFlagProvider,
  IdleProvider,
  IdleState,
} from '@noice-com/common-ui';
import { Client } from '@noice-com/platform-client';
import { ClientType } from '@noice-com/schemas/api/client.pb';
import { Auth } from '@noice-com/schemas/auth/auth.pb';
import { makeLoggers, Nullable } from '@noice-com/utils';
import { sha256 } from 'crypto-hash';
import { Suspense, useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Navigate, Route, BrowserRouter, HashRouter, Routes } from 'react-router-dom';

import { AccountApp } from './AccountApp';
import * as embed from './embeds/bridge';
import { Embed } from './embeds/Embed';
import { useHandleAppIdleState } from './hooks/useHandleAppIdleState.hook';
import { Logout } from './pages/Logout/Logout';
import { SignupRoute } from './pages/Signup/SignupRoute';
import { PlatformApp } from './PlatformApp';

import faviconApple from '@assets/public/apple-touch-icon.png';
import favicon16 from '@assets/public/favicon-16x16.png';
import favicon32 from '@assets/public/favicon-32x32.png';
import favicon from '@assets/public/favicon.ico';
import { useInitialPageViewAnalytics } from '@common/analytics';
import { EnvironmentCheckProvider } from '@common/environment';
import { getAppLocalStorageDefaults, AppLocalStorageKeys } from '@common/localstorage';
import { Routes as RoutePaths, redirects } from '@common/route';
import { defaultSessionData } from '@common/session-storage';
import { AppSoundKeys } from '@common/sound';
import { AppUIEvents } from '@common/ui-event';
import { FeatureFlagProvider, MicroSurveyProvider } from '@context';
import { AppErrorFallback } from '@page/PageErrorFallback';
import { OAuth } from '@pages/OAuth/OAuth';

const OFFLINE_TIMEOUT = 1000 * 60 * 60 * 3; // 3 hours

let routingBaseName = process.env.BASE_PATH;

// eslint-disable-next-line
let ActiveRouter: any;

if (window.NOICE.HASH_ROUTING) {
  ActiveRouter = HashRouter;
  routingBaseName = '/';
} else {
  ActiveRouter = BrowserRouter;
}

const client = new Client(
  NOICE.SERVICES_LIB_HOST,
  {
    useWSMuxer: true,
    sessionManager: embed.getSessionManager(),
    forceWSStreaming: true,
  },
  NOICE.AUTH_BASE_URL,
  'platform',
);
const uiEventsHandler = new UIEventsHandler<AppUIEvents>();
const FTUEActionHandler = new FTUEActionsHandler();
const soundController = new SoundController<AppLocalStorageKeys>();

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

window.NOICE.__SoundKeys__ = AppSoundKeys;
window.NOICE.__Client = client;
window.NOICE.__SoundController = soundController;

monkeyPatchAnalytics(
  client,
  embed.isReactNativeWebView()
    ? ClientType.CLIENT_TYPE_PLATFORM_MOBILE
    : ClientType.CLIENT_TYPE_PLATFORM_WEB,
);

const { logError } = makeLoggers('APP');

const App = () => {
  const [localUserData, setLocalUserData] =
    useState<Nullable<LocalUserData<AppLocalStorageKeys>>>(null);

  // @todo: use this instead of Routes, once we have figure why it is clearing has & search params
  // const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

  useInitialPageViewAnalytics(client);
  useClientLoadAnalytics(client);

  useEffect(() => {
    const setDefaultLocalUserData = async () => {
      const defaultOptions = await getAppLocalStorageDefaults();
      const userData = new LocalUserData(defaultOptions, null);

      soundController.localUserData = userData;
      setLocalUserData(userData);
    };

    setDefaultLocalUserData();

    const authCallback = async (auth: Auth) => {
      const defaultOptions = await getAppLocalStorageDefaults();

      setLocalUserData((prev) => {
        if (!auth.uid) {
          logError("User is not authenticated or doesn't have UID");
          return null;
        }

        if (prev && prev.userId === auth.uid) {
          return prev;
        }

        const userData = new LocalUserData(defaultOptions, auth.uid);
        soundController.localUserData = userData;

        return userData;
      });
    };

    return client.onAuthenticated(authCallback);
  }, []);

  useEffect(() => {
    const flushEvents = () => {
      client.AnalyticsService.sendEventsImmediately({ keepalive: true });
    };

    window.addEventListener('beforeunload', flushEvents);

    return () => {
      window.removeEventListener('beforeunload', flushEvents);
    };
  }, []);

  const { idleState, handleIdleStateChange } = useHandleAppIdleState(client);

  if (idleState === IdleState.OFFLINE) {
    // User has kept the page hidden for too long and is now considered offline
    return (
      <ErrorBoundary
        client={client}
        fallback={AppErrorFallback}
      >
        <IdleProvider
          offlineTimeoutMs={OFFLINE_TIMEOUT}
          onIdleStateChange={handleIdleStateChange}
        >
          <FullscreenSpinner />
        </IdleProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary
      client={client}
      fallback={AppErrorFallback}
    >
      <IdleProvider
        offlineTimeoutMs={OFFLINE_TIMEOUT}
        onIdleStateChange={handleIdleStateChange}
      >
        <SoundControllerProvider soundController={soundController}>
          <FeatureFlagProvider>
            <LocalUserDataProvider localUserData={localUserData}>
              <SessionStorageProvider defaultData={defaultSessionData}>
                <ClientProvider client={client}>
                  <ConversionEventsProvider dataLayer={window.dataLayer}>
                    <AnalyticProvider>
                      <ApolloProvider client={apolloClient}>
                        <HelmetProvider>
                          <Helmet titleTemplate="%s / Noice">
                            <title>Play</title>
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
                          <UIEventHandlerProvider uiEventsHandler={uiEventsHandler}>
                            <FTUEActionHandlerProvider actionHandler={FTUEActionHandler}>
                              <AuthProvider
                                client={client}
                                loginRoute="/signup"
                                restoreSession={
                                  embed.isReactNativeWebView()
                                    ? embed.restoreSession
                                    : undefined
                                }
                              >
                                <ActiveRouter basename={routingBaseName}>
                                  <KeyContentLoadTrackerProvider>
                                    <EnvironmentCheckProvider>
                                      <RemoteFeatureFlagProvider>
                                        <MicroSurveyProvider>
                                          <TitleAnnouncer />

                                          <Routes>
                                            <Route
                                              element={<OAuth />}
                                              path={`${RoutePaths.OAuth}/*`}
                                            />
                                            {redirects.map(({ from, to }, index) => (
                                              <Route
                                                element={
                                                  <Navigate
                                                    to={to}
                                                    replace
                                                  />
                                                }
                                                key={index}
                                                path={from}
                                              />
                                            ))}
                                            <Route
                                              element={<SignupRoute />}
                                              path={`${RoutePaths.Signup}/*`}
                                            />
                                            <Route
                                              element={<Logout />}
                                              path={RoutePaths.Logout}
                                            />
                                            <Route
                                              element={
                                                <Suspense
                                                  fallback={<FullscreenSpinner />}
                                                >
                                                  <Embed
                                                    loadingUserData={!localUserData}
                                                  />
                                                </Suspense>
                                              }
                                              path="/embed/*"
                                            />

                                            <Route
                                              element={<AccountApp />}
                                              path={`${RoutePaths.Account}/*`}
                                            />

                                            <Route
                                              element={
                                                localUserData ? (
                                                  <PlatformApp />
                                                ) : (
                                                  <FullscreenSpinner />
                                                )
                                              }
                                              path="*"
                                            />
                                          </Routes>
                                        </MicroSurveyProvider>
                                      </RemoteFeatureFlagProvider>
                                    </EnvironmentCheckProvider>
                                  </KeyContentLoadTrackerProvider>
                                </ActiveRouter>
                              </AuthProvider>
                            </FTUEActionHandlerProvider>
                          </UIEventHandlerProvider>
                        </HelmetProvider>
                      </ApolloProvider>
                    </AnalyticProvider>
                  </ConversionEventsProvider>
                </ClientProvider>
              </SessionStorageProvider>
            </LocalUserDataProvider>
          </FeatureFlagProvider>
        </SoundControllerProvider>
      </IdleProvider>
    </ErrorBoundary>
  );
};

export default App;
