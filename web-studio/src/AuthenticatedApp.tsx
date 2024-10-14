import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import {
  ErrorBoundary,
  PlatformAnnouncementsModal,
  useAuthenticatedUser,
  useBooleanFeatureFlag,
  useCommonSoundLoader,
  useInitZendeskWidget,
  useSoundController,
} from '@noice-com/common-ui';
import * as Sentry from '@sentry/react';
import { useEffect, useLayoutEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { usePlatformBan } from './hooks/usePlatformBan.hook';
import { PageErrorFallback } from './page/PageErrorFallback';
import { Analytics } from './pages/Analytics';
import { AnalyticsChannel } from './pages/Analytics/AnalyticsChannel';
import { AnalyticsLatestStream } from './pages/Analytics/AnalyticsLatestStream';
import { GettingStarted } from './pages/GettingStarted';
import { SettingsRedirectPage } from './pages/Settings';
import { SettingsSimulcasting } from './pages/SettingsSimulcasting';

import { useAnnouncements } from '@common/announcements';
import { useOnboardingContext } from '@common/onboarding';
import { usePermissionRedirect } from '@common/permission';
import { Routes as AppRoutes } from '@common/route';
import { useAuthenticatedAppDataQuery } from '@gen';
import { PageWrapper } from '@page';
import {
  SettingsAutoMod,
  SettingsBanned,
  SettingsChannel,
  SettingsChannelDetails,
  SettingsChannelBranding,
  SettingsModeration,
  SettingsRoles,
  SettingsStream,
  StreamManager,
  Home,
  Monetization,
  Alerts,
  MonetizationIndex,
  Challenges,
} from '@pages';

gql`
  query AuthenticatedAppData($userId: ID!) {
    profile(userId: $userId) {
      userId
      ...ZendeskPrefillProfile
    }
  }
`;

export function AuthenticatedApp() {
  const { isOnboardingDataLoading } = useOnboardingContext();
  const { userId } = useAuthenticatedUser();
  usePlatformBan();
  const { announcements, onModalClose, isModalOpen } = useAnnouncements();
  const { data } = useAuthenticatedAppDataQuery({
    ...variablesOrSkip({ userId }),
  });

  usePermissionRedirect();
  useInitZendeskWidget({ profile: data?.profile ?? null, zE: window.zE });

  useLayoutEffect(() => {
    // Scroll to the top of the page when the route changes
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [location.pathname]);

  const soundController = useSoundController();
  const soundLoader = useCommonSoundLoader();

  const [showSimulcasting] = useBooleanFeatureFlag(
    'streaming_showStudioSettingsSimulcastRestreamer',
  );

  useEffect(() => {
    if (!soundLoader) {
      return;
    }

    soundController.registerActiveLoader(soundLoader);

    return () => {
      soundController.detachActiveLoader();
    };
  }, [soundController, soundLoader]);

  useEffect(() => {
    Sentry.setUser({ id: userId });

    return () => {
      Sentry.setUser(null);
    };
  }, [userId]);

  if (isOnboardingDataLoading) {
    return null;
  }

  return (
    <PageWrapper>
      <ErrorBoundary fallback={PageErrorFallback}>
        <PlatformAnnouncementsModal
          announcements={announcements}
          isOpen={isModalOpen}
          onClose={onModalClose}
        />

        <Routes>
          <Route
            element={<Home />}
            path="/"
          />
          <Route
            element={<GettingStarted />}
            path={AppRoutes.GettingStarted}
          />
          <Route
            element={<StreamManager />}
            path={AppRoutes.StreamManager}
          />
          <Route
            element={<Alerts />}
            path={AppRoutes.Alerts}
          />
          <Route
            element={<Challenges />}
            path={AppRoutes.Challenges}
          />

          <Route
            element={<SettingsRedirectPage />}
            path={AppRoutes.Settings}
          >
            <Route
              element={<SettingsStream />}
              path={AppRoutes.SettingsStream}
            />

            {showSimulcasting && (
              <Route
                element={<SettingsSimulcasting />}
                path={AppRoutes.SettingsSimulcasting}
              />
            )}

            <Route
              element={<SettingsChannel />}
              path={AppRoutes.SettingsChannelDetails}
            >
              <Route
                element={<SettingsChannelDetails />}
                path={AppRoutes.SettingsChannelDetails}
              />
              <Route
                element={<SettingsChannelBranding />}
                path={AppRoutes.SettingsChannelBranding}
              />
            </Route>

            <Route
              element={<SettingsModeration />}
              path={AppRoutes.SettingsModeration}
            >
              <Route
                element={<SettingsRoles />}
                path={AppRoutes.SettingsModeration}
              />
              <Route
                element={<SettingsAutoMod />}
                path={AppRoutes.SettingsAutoMod}
              />
              <Route
                element={<SettingsBanned />}
                path={AppRoutes.SettingsBanned}
              />
            </Route>
          </Route>
          <Route
            element={<Monetization />}
            path={`${AppRoutes.Monetization}`}
          >
            <Route
              element={<MonetizationIndex />}
              index
            />
            <Route
              element={<MonetizationIndex />}
              path={`${AppRoutes.MonetizationSubscriptions}/*`}
            />
            <Route
              element={<MonetizationIndex />}
              path={`${AppRoutes.MonetizationCreatorCards}/*`}
            />
          </Route>
          <Route
            element={<Analytics />}
            path={AppRoutes.Analytics}
          >
            <Route
              element={<AnalyticsChannel />}
              path={AppRoutes.AnalyticsChannel}
            />
            <Route
              element={<AnalyticsLatestStream />}
              path={AppRoutes.AnalyticsLatestStream}
            />
          </Route>
        </Routes>
      </ErrorBoundary>
    </PageWrapper>
  );
}
