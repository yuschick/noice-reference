import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from '@noice-com/apollo-client-utils';
import { ClientProvider, useMountEffect } from '@noice-com/common-react-core';
import {
  LocalUserData,
  LocalUserDataProvider,
  SoundController,
  SoundControllerProvider,
  AuthProvider,
  CommonUserDataKeys,
  monkeyPatchAnalytics,
  EnvironmentNameBar,
  FeatureFlagProvider,
  ErrorBoundary,
  useClientLoadAnalytics,
} from '@noice-com/common-ui';
import { Client } from '@noice-com/platform-client';
import { ClientType } from '@noice-com/schemas/api/client.pb';
import { makeLoggers, Nullable } from '@noice-com/utils';
import { sha256 } from 'crypto-hash';
import { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter, HashRouter, Routes } from 'react-router-dom';

import { PermissionRoute } from './module-common/PermissionRoute/PermissionRoute';
import { Home } from './page/Home/Home';
import { AppErrorFallback, PageErrorFallback } from './page/PageErrorFallback';

import { ProtectedRoute, LoginRoutes } from '@common/route';
import { ModuleRouterProvider } from '@module-common';
import { modulePathPermissions, routes, VideoReport } from '@modules';
import { NotFoundPage, ContentWrapper, PageWrapper } from '@page';
import { Login, Logout, NoAccess } from '@pages';

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

const soundController = new SoundController();
const client = new Client(
  NOICE.SERVICES_LIB_HOST,
  {
    useWSMuxer: true,
    forceWSStreaming: true,
  },
  NOICE.AUTH_BASE_URL,
  'admin',
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
  preventInfinityPagination: true,
  customLinkConnectionRetryWait,
  sha256,
});

monkeyPatchAnalytics(client, ClientType.CLIENT_TYPE_ADMIN_WEB);

const { logError } = makeLoggers('APP');

const App = () => {
  const [localUserData, setLocalUserData] = useState<Nullable<LocalUserData>>(null);

  useMountEffect(() => {
    client.onAuthenticated((auth) => {
      if (!auth.uid) {
        logError('No UID in auth');
        return;
      }

      const userData = new LocalUserData<CommonUserDataKeys>(
        {
          'audio.volume.master': 1,
          'audio.volume.effects': 1,
          'audio.volume.stream': 1,
          'audio.muted': true,
          'channel.selected': null,
          'channel.recentlyVisited': null,
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
      <ClientProvider client={client}>
        <AuthProvider
          client={client}
          loginRoute="/login"
        >
          <ApolloProvider client={apolloClient}>
            <LocalUserDataProvider localUserData={localUserData}>
              <SoundControllerProvider soundController={soundController}>
                <HelmetProvider>
                  <EnvironmentNameBar />
                  <Helmet
                    defaultTitle="Noice Admin"
                    titleTemplate="%s / Noice Admin"
                  />

                  <ActiveRouter basename={ROUTING_BASE_NAME}>
                    <Routes>
                      <Route
                        element={<Login />}
                        path={`${LoginRoutes.LogIn}/*`}
                      />
                      <Route
                        element={<Logout />}
                        path={LoginRoutes.LogOut}
                      />
                      {/** The (protected) pages with navigation layout */}
                      <Route
                        element={
                          <ProtectedRoute>
                            <FeatureFlagProvider>
                              <ModuleRouterProvider
                                modulePathPermissions={modulePathPermissions}
                              >
                                <PageWrapper>
                                  <ErrorBoundary fallback={PageErrorFallback}>
                                    <Routes>
                                      <Route
                                        element={<NoAccess />}
                                        path={LoginRoutes.NoAccess}
                                      />

                                      {routes.map((route) => (
                                        <Route
                                          element={
                                            <PermissionRoute>
                                              <ContentWrapper>
                                                {route.component}
                                              </ContentWrapper>
                                            </PermissionRoute>
                                          }
                                          key={route.path}
                                          path={route.path}
                                        />
                                      ))}

                                      <Route
                                        element={<VideoReport />}
                                        path="/reports/video/:caseId"
                                      />

                                      <Route
                                        element={<Home />}
                                        path="/"
                                      />

                                      <Route
                                        element={<NotFoundPage />}
                                        path="*"
                                      />
                                    </Routes>
                                  </ErrorBoundary>
                                </PageWrapper>
                              </ModuleRouterProvider>
                            </FeatureFlagProvider>
                          </ProtectedRoute>
                        }
                        path="*"
                      />
                    </Routes>
                  </ActiveRouter>

                  <Toaster
                    toastOptions={{
                      position: 'bottom-center',
                    }}
                  />
                </HelmetProvider>
              </SoundControllerProvider>
            </LocalUserDataProvider>
          </ApolloProvider>
        </AuthProvider>
      </ClientProvider>
    </ErrorBoundary>
  );
};

export default App;
