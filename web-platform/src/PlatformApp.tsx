import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { CardGameAPIProvider, StreamGameProvider } from '@noice-com/card-game';
import { ChatAPIProvider } from '@noice-com/chat-react-web';
import {
  PlatformAnnouncementsModal,
  ErrorBoundary,
  useAuthentication,
  usePageViewAnalytics,
  useKeyContentLoadTracker,
  useInitZendeskWidget,
  AuthenticatedUserProvider,
} from '@noice-com/common-ui';
import { SocialPackageProvider, PartyProvider } from '@noice-com/social';
import { StreamAPIProvider } from '@noice-com/stream';
import { useCallback, useEffect } from 'react';
import { Routes, Route, useBeforeUnload, useLocation, Navigate } from 'react-router-dom';

import { FTUE } from './FTUE';
import { useFeatureFlagFromUrl } from './hooks/useFeatureFlagFromUrl.hook';
import { AvatarAdmin } from './pages/AvatarAdmin/AvatarAdmin';
import { Channel, ChannelStoreItem } from './pages/Channel';
import { ChannelBan } from './pages/ChannelBan/ChannelBan';
import { DailyGoals } from './pages/DailyGoals/DailyGoals';
import { Home } from './pages/Home/Home';
import { NotFound } from './pages/NotFound/NotFound';
import { PartyAdmin } from './pages/PartyAdmin/PartyAdmin';
import { Profile } from './pages/Profile/Profile';
import { Settings } from './pages/Settings/Settings';
import { Store } from './pages/Store/Store';

import { useAnnouncements } from '@common/announcement';
import {
  AuthenticatedPageWrapper,
  AuthInBackgroundStateProvider,
  useAuthenticatedUserRedirects,
} from '@common/auth';
import { AvatarSaveProvider } from '@common/avatar';
import {
  MatureRatedContentDialogProvider,
  MatureRatedContentDialogs,
} from '@common/channel';
import { DebugProvider } from '@common/debug';
import { PlatformGameView } from '@common/game/PlatformGameView'; // Need to import these directly because otherwise getting renderer packages errors in CI build
import { PlatformLeaderboardProvider } from '@common/game/PlatformLeaderboardProvider'; // Need to import these directly because otherwise getting renderer packages errors in CI build
import {
  ImplicitAccountUpSellingProvider,
  UpSellingDialog,
} from '@common/implicit-account';
import { NotificationProvider } from '@common/notification';
import { PlatformAppAuthHooks } from '@common/platform-app';
import { generateProfileLink } from '@common/profile';
import {
  Routes as RoutePaths,
  ChannelRoutes,
  useIsChannelRoute,
  AuthenticatedRoute,
} from '@common/route';
import { SearchRoutes } from '@common/route/types';
import { SeasonEndDialog, SeasonStartDialog } from '@common/season';
import { SendGiftDialogProvider } from '@common/send-gift-dialog';
import { useListenSessionStorageValue } from '@common/session-storage';
import { StreamGameProxyProvider, StreamStateProvider } from '@common/stream';
import { FirebaseProvider, WebPushProvider } from '@common/web-push-notifications';
import { SelectedUIStateProvider } from '@context';
import { usePlatformAppDataQuery } from '@gen';
import { PageErrorFallback } from '@page/PageErrorFallback';
import { PageLayout } from '@page/PageLayout';
import { AvatarEditorPage } from '@pages/AvatarEditor';
import { Browse } from '@pages/Browse';
import { Collection } from '@pages/Collection';
import { Following } from '@pages/Following';
import { Search } from '@pages/Search';
import { ChannelSearchResults } from '@pages/Search/SearchResults';
import { CategorySearchResults } from '@pages/Search/SearchResults/CategorySearchResults';
import { Seasons } from '@pages/Seasons';
import { StoreItem } from '@pages/Store';

gql`
  query PlatformAppData($userId: ID!) {
    profile(userId: $userId) {
      userId
      ...ZendeskPrefillProfile
      ...SeasonEndDialogWrapperProfile
      ...PageLayoutProfile
    }
  }
`;

export const PlatformApp = () => {
  const { userId, isFullAccount, hasRole } = useAuthentication();
  const location = useLocation();
  const [_storageActiveStreamId, setStorageActiveStreamId] = useListenSessionStorageValue(
    'gameStream.active.streamId',
  );

  const { data, loading } = usePlatformAppDataQuery({
    ...variablesOrSkip({ userId }),
  });

  useKeyContentLoadTracker('user_data', loading);

  useInitZendeskWidget({ profile: data?.profile ?? null, zE: window.zE });
  usePageViewAnalytics();
  useFeatureFlagFromUrl();
  useAuthenticatedUserRedirects();

  const { announcements, onModalClose, isModalOpen } = useAnnouncements();
  const { isChannelRoute } = useIsChannelRoute();

  useBeforeUnload(
    useCallback(() => {
      // Clear the active stream id when reloading page somewhere else then channel page
      if (!isChannelRoute) {
        setStorageActiveStreamId('');
      }
    }, [isChannelRoute, setStorageActiveStreamId]),
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <AuthInBackgroundStateProvider
      // @todo: set correct values when we support auth in background
      hasAuthFailed={false}
      isAuthLoading={false}
    >
      <SocialPackageProvider createProfileRoutePath={generateProfileLink}>
        <AuthenticatedRoute>
          <StreamGameProvider>
            <StreamGameProxyProvider>
              <DebugProvider>
                <PartyProvider>
                  <StreamStateProvider>
                    <ChatAPIProvider>
                      <SendGiftDialogProvider>
                        <FirebaseProvider>
                          <SelectedUIStateProvider>
                            <NotificationProvider>
                              <WebPushProvider>
                                <AvatarSaveProvider>
                                  {/* This (leaderboard provider) is needed in this level for FTUE */}
                                  <PlatformLeaderboardProvider>
                                    <CardGameAPIProvider>
                                      <StreamAPIProvider>
                                        <ImplicitAccountUpSellingProvider>
                                          <MatureRatedContentDialogProvider>
                                            {!!userId && (
                                              <AuthenticatedUserProvider userId={userId}>
                                                <PlatformAppAuthHooks />

                                                <FTUE />

                                                <PlatformAnnouncementsModal
                                                  announcements={announcements}
                                                  isOpen={isModalOpen}
                                                  onClose={onModalClose}
                                                />

                                                <SeasonStartDialog />

                                                <SeasonEndDialog
                                                  profile={data?.profile ?? null}
                                                />

                                                <MatureRatedContentDialogs />
                                              </AuthenticatedUserProvider>
                                            )}

                                            {!isFullAccount && <UpSellingDialog />}

                                            <PageLayout profile={data?.profile ?? null}>
                                              <PlatformGameView />

                                              <ErrorBoundary fallback={PageErrorFallback}>
                                                <Routes>
                                                  <Route
                                                    element={<Home />}
                                                    path={RoutePaths.Home}
                                                  />

                                                  <Route
                                                    element={
                                                      <AuthenticatedPageWrapper>
                                                        <Browse />
                                                      </AuthenticatedPageWrapper>
                                                    }
                                                    path={`${RoutePaths.Browse}/*`}
                                                  />

                                                  <Route
                                                    element={
                                                      <AuthenticatedPageWrapper>
                                                        <AvatarEditorPage />
                                                      </AuthenticatedPageWrapper>
                                                    }
                                                    path={RoutePaths.Avatar}
                                                  />

                                                  <Route path={RoutePaths.Channel}>
                                                    <Route
                                                      element={<Channel />}
                                                      index
                                                    />

                                                    <Route
                                                      element={
                                                        <AuthenticatedPageWrapper>
                                                          <ChannelStoreItem />
                                                        </AuthenticatedPageWrapper>
                                                      }
                                                      path={
                                                        ChannelRoutes.ChannelStoreItem
                                                      }
                                                    />
                                                  </Route>

                                                  <Route path={RoutePaths.Store}>
                                                    <Route
                                                      element={<Store />}
                                                      index
                                                    />

                                                    <Route
                                                      element={<Store />}
                                                      path=":gameCreators"
                                                    />

                                                    <Route
                                                      element={<StoreItem />}
                                                      path=":gameCreators/:storeItemId"
                                                    />
                                                  </Route>

                                                  <Route path={RoutePaths.Collection}>
                                                    <Route
                                                      element={
                                                        <AuthenticatedPageWrapper>
                                                          <Collection />
                                                        </AuthenticatedPageWrapper>
                                                      }
                                                      index
                                                    />

                                                    <Route
                                                      element={
                                                        <AuthenticatedPageWrapper>
                                                          <Collection />
                                                        </AuthenticatedPageWrapper>
                                                      }
                                                      path=":gameCreators"
                                                    />

                                                    <Route
                                                      element={
                                                        <AuthenticatedPageWrapper>
                                                          <Collection />
                                                        </AuthenticatedPageWrapper>
                                                      }
                                                      path=":gameCreators/:seasonId"
                                                    />

                                                    <Route
                                                      element={
                                                        <AuthenticatedPageWrapper>
                                                          <Collection />
                                                        </AuthenticatedPageWrapper>
                                                      }
                                                      path=":gameCreators/:seasonId/:itemId"
                                                    />
                                                  </Route>

                                                  <Route
                                                    element={
                                                      <AuthenticatedPageWrapper>
                                                        <Seasons />
                                                      </AuthenticatedPageWrapper>
                                                    }
                                                    path={`${RoutePaths.Seasons}`}
                                                  />

                                                  <Route
                                                    element={
                                                      <AuthenticatedPageWrapper>
                                                        <Search />
                                                      </AuthenticatedPageWrapper>
                                                    }
                                                    path={RoutePaths.Search}
                                                  >
                                                    <Route
                                                      element={
                                                        <Navigate
                                                          to={{
                                                            pathname:
                                                              SearchRoutes.SearchChannels,
                                                            search: location.search,
                                                          }}
                                                          replace
                                                        />
                                                      }
                                                      path="*"
                                                      index
                                                    />
                                                    <Route
                                                      element={
                                                        <AuthenticatedPageWrapper>
                                                          <ChannelSearchResults />
                                                        </AuthenticatedPageWrapper>
                                                      }
                                                      path={SearchRoutes.SearchChannels}
                                                    />
                                                    <Route
                                                      element={
                                                        <AuthenticatedPageWrapper>
                                                          <CategorySearchResults />
                                                        </AuthenticatedPageWrapper>
                                                      }
                                                      path={SearchRoutes.SearchCategories}
                                                    />
                                                  </Route>

                                                  <Route
                                                    element={<Following />}
                                                    path={RoutePaths.Following}
                                                  />

                                                  <Route
                                                    element={
                                                      <AuthenticatedPageWrapper>
                                                        <ChannelBan />
                                                      </AuthenticatedPageWrapper>
                                                    }
                                                    path={RoutePaths.ChannelBan}
                                                  />

                                                  <Route
                                                    element={
                                                      <AuthenticatedPageWrapper>
                                                        <Profile />
                                                      </AuthenticatedPageWrapper>
                                                    }
                                                    path={RoutePaths.Profile}
                                                  />

                                                  {!!isFullAccount && (
                                                    <>
                                                      <Route
                                                        element={
                                                          <AuthenticatedPageWrapper>
                                                            <Settings />
                                                          </AuthenticatedPageWrapper>
                                                        }
                                                        path={`${RoutePaths.Settings}/*`}
                                                      />

                                                      <Route
                                                        element={
                                                          <AuthenticatedPageWrapper>
                                                            <DailyGoals />
                                                          </AuthenticatedPageWrapper>
                                                        }
                                                        path={`${RoutePaths.DailyGoals}`}
                                                      />
                                                    </>
                                                  )}

                                                  {hasRole('admin') && (
                                                    <>
                                                      <Route
                                                        element={
                                                          <AuthenticatedPageWrapper>
                                                            <PartyAdmin />
                                                          </AuthenticatedPageWrapper>
                                                        }
                                                        path={RoutePaths.PartyAdmin}
                                                      />

                                                      <Route
                                                        element={
                                                          <AuthenticatedPageWrapper>
                                                            <AvatarAdmin />
                                                          </AuthenticatedPageWrapper>
                                                        }
                                                        path={RoutePaths.AvatarAdmin}
                                                      />
                                                    </>
                                                  )}

                                                  <Route
                                                    element={<NotFound />}
                                                    path={RoutePaths.NotFound}
                                                  />

                                                  <Route
                                                    element={<NotFound />}
                                                    path="*"
                                                  />
                                                </Routes>
                                              </ErrorBoundary>
                                            </PageLayout>
                                          </MatureRatedContentDialogProvider>
                                        </ImplicitAccountUpSellingProvider>
                                      </StreamAPIProvider>
                                    </CardGameAPIProvider>
                                  </PlatformLeaderboardProvider>
                                </AvatarSaveProvider>
                              </WebPushProvider>
                            </NotificationProvider>
                          </SelectedUIStateProvider>
                        </FirebaseProvider>
                      </SendGiftDialogProvider>
                    </ChatAPIProvider>
                  </StreamStateProvider>
                </PartyProvider>
              </DebugProvider>
            </StreamGameProxyProvider>
          </StreamGameProvider>
        </AuthenticatedRoute>
      </SocialPackageProvider>
    </AuthInBackgroundStateProvider>
  );
};
