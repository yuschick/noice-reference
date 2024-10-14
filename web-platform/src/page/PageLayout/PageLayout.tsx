import { gql } from '@apollo/client';
import {
  AuthenticatedUserProvider,
  Button,
  Callout,
  VisuallyHidden,
  WithChildren,
  useAuthentication,
  useBooleanFeatureFlag,
} from '@noice-com/common-ui';
import { FriendsView } from '@noice-com/social';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { matchPath, useLocation } from 'react-router';

import { isReactNativeWebView } from '../../embeds/bridge';

import { ExpandedSidebarNavigation } from './ExpandedSidebarNavigation/ExpandedSidebarNavigation';
import { ExpandedSocialSidebar } from './ExpandedSocialSidebar';
import styles from './PageLayout.module.css';
import { PageLayoutHeader } from './PageLayoutHeader';
import { PageLayoutMain } from './PageLayoutMain';
import { PageLayoutSidebarNavigation } from './PageLayoutSidebarNavigation';
import { PageLayoutSidebarSocial } from './PageLayoutSidebarSocial';
import {
  EXPANDED_NAVIGATION_SIDEBAR_ID,
  EXPANDED_SOCIAL_SIDEBAR_ID,
  MAIN_ID,
} from './utils';

import { useEnvironmentCheck } from '@common/environment';
import { MobileAppCtaBanner } from '@common/mobile-app-cta';
import { SocialSidebarStateProvider } from '@common/page';
import { excludedFromImplicitAccount, fullScreenPages } from '@common/route';
import { useSpectatorModeEnabled, StreamViewState, useStreamState } from '@common/stream';
import { PageLayoutProfileFragment } from '@gen';

gql`
  fragment PageLayoutProfile on ProfileProfile {
    ...PageLayoutHeaderProfile
  }
`;

interface Props {
  profile: Nullable<PageLayoutProfileFragment>;
}

export function PageLayout({ children, profile }: WithChildren<Props>) {
  const location = useLocation();
  const [isNavigationSidebarExpanded, setIsNavigationSidebarExpanded] = useState(false);
  const [isSocialSidebarExpanded, setIsSocialSidebarExpanded] = useState(false);
  const [friendsView, setFriendsView] = useState<FriendsView>(FriendsView.Accepted);
  const [warningBannerVisible, setWarningBannerVisible] = useState(true);

  const [showMobileAppBanner, loadingMobileAppBannerFlag] = useBooleanFeatureFlag(
    'noiceAppCtaBanner',
    false,
  );

  const { isFullAccount, userId } = useAuthentication();
  const { streamViewState } = useStreamState();
  const spectatorMode = useSpectatorModeEnabled();
  const { isSupportedBrowser } = useEnvironmentCheck();
  const isEmbedded = isReactNativeWebView();

  const onExpandedSidebar = (sidebar: 'navigation' | 'social') => {
    if (sidebar === 'navigation') {
      setIsNavigationSidebarExpanded(true);
      return;
    }

    setIsSocialSidebarExpanded(true);
  };

  const onExpandSocialSidebarOnView = (view: FriendsView) => {
    setIsSocialSidebarExpanded(true);
    setFriendsView(view);
  };

  useEffect(() => {
    // Close expanded sidebars when navigating to a new page
    setIsNavigationSidebarExpanded(false);
    setIsSocialSidebarExpanded(false);
  }, [location]);

  const isFullPage = fullScreenPages
    .filter((page) => {
      if (isFullAccount) {
        return true;
      }

      return !excludedFromImplicitAccount.includes(page);
    })
    .some((fullScreenPage) => !!matchPath(fullScreenPage, location.pathname));
  const isFullScreenStream = streamViewState === StreamViewState.Full;

  const showHeader = !spectatorMode && !isFullPage && !isEmbedded;
  const navigationSidebar = !spectatorMode && !isFullPage;
  const showSocialSidebar =
    !spectatorMode && !isFullPage && !isFullScreenStream && !!isFullAccount && !!userId;

  const showMobileAppCtaBanner =
    !isEmbedded && showMobileAppBanner && !isFullPage && !loadingMobileAppBannerFlag;

  return (
    <>
      {showMobileAppCtaBanner && (
        <div
          className={classNames({
            [styles.bottomBanner]: isFullScreenStream,
          })}
        >
          <MobileAppCtaBanner />
        </div>
      )}
      <SocialSidebarStateProvider
        onExpandSocialSidebarOnView={onExpandSocialSidebarOnView}
      >
        <VisuallyHidden classNameOnFocus={styles.skipToMainContentLink}>
          <a
            href={`#${MAIN_ID}`}
            id={styles.skipToMainContentLink}
          >
            Skip to main content
          </a>
        </VisuallyHidden>

        <div
          className={classNames({
            [styles.fullScreenStream]: isFullScreenStream,
            [styles.fullScreenPage]: isFullPage,
            [styles.layoutDisableRowTemplate]: isEmbedded,
          })}
          data-friends-sidebar-exists={showSocialSidebar}
          data-ftue-anchor="site-wide"
          id={styles.platformLayoutContainer}
        >
          {!isSupportedBrowser && warningBannerVisible && (
            <div className={styles.unsupportedBrowserWarning}>
              <Callout
                message="Noice is not yet supported on this browser. For the most optimal experience,
              use Google Chrome, Microsoft Edge, Opera or Brave."
                slots={{
                  actions: {
                    primary: (
                      <Button
                        size="xs"
                        onClick={() => setWarningBannerVisible(false)}
                      >
                        Dismiss
                      </Button>
                    ),
                  },
                }}
                type="error"
              />
            </div>
          )}

          {showHeader && (
            <PageLayoutHeader
              navigationExpandButtonAriaAttributes={{
                'aria-controls': EXPANDED_NAVIGATION_SIDEBAR_ID,
                'aria-expanded': isNavigationSidebarExpanded ? 'true' : 'false',
              }}
              profile={profile}
              socialExpandButtonAriaAttributes={{
                'aria-controls': EXPANDED_SOCIAL_SIDEBAR_ID,
                'aria-expanded': isSocialSidebarExpanded ? 'true' : 'false',
              }}
              onExpandedSidebar={onExpandedSidebar}
            />
          )}

          {navigationSidebar && <PageLayoutSidebarNavigation />}

          <PageLayoutMain
            hasBrowserWarning={!isSupportedBrowser && warningBannerVisible}
            isFullScreenPage={isFullPage}
          >
            {children}
          </PageLayoutMain>

          {showSocialSidebar && (
            <AuthenticatedUserProvider userId={userId}>
              <PageLayoutSidebarSocial
                onExpandSocialSidebarOnView={onExpandSocialSidebarOnView}
              />
            </AuthenticatedUserProvider>
          )}
        </div>

        <ExpandedSidebarNavigation
          isExpanded={isNavigationSidebarExpanded}
          onCollapse={() => setIsNavigationSidebarExpanded(false)}
        />

        <ExpandedSocialSidebar
          isExpanded={isSocialSidebarExpanded}
          selectedFriendsView={friendsView}
          onCollapse={() => setIsSocialSidebarExpanded(false)}
          onSelectFriendsView={setFriendsView}
        />
      </SocialSidebarStateProvider>
    </>
  );
}
