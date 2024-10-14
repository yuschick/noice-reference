import {
  AuthenticatedUserProvider,
  FeatureFlagProvider,
  useAuthentication,
} from '@noice-com/common-ui';
import { SocialPackageProvider } from '@noice-com/social';
import { StreamAPIProvider, StreamSettingsProvider } from '@noice-com/stream';

import { useNavigateOnLogout } from '../navigation/hooks/useNavigateOnLogout.hook';

import { ActivityFeedSettingsProvider } from './ActivityFeed';
import { AudienceInsightsSettingsProvider } from './AudienceInsights/AudienceInsightsSettingsProvider';
import { ChatUserListSettingsProvider } from './ChatUserListWidget';
import { WidgetLayoutProvider, WidgetMenuProvider } from './context';

import {
  AvailableChannelsProvider,
  ChannelProvider,
  ChannelRouteProvider,
} from '@common/channel';
import { Routes } from '@common/route';
import { StreamProvider } from '@common/stream';
import { ExternalPopoutWrapper } from '@common/widget-popout';

export function WidgetRoute() {
  const { isAuthenticated, initialized, userId } = useAuthentication();

  useNavigateOnLogout({
    to: {
      pathname: Routes.PopoutSignin,
      search: `from=${location.pathname}${encodeURIComponent(location.search)}`,
    },
  });

  if (!initialized || !isAuthenticated() || !userId) {
    return null;
  }

  return (
    <AuthenticatedUserProvider userId={userId}>
      <SocialPackageProvider createProfileRoutePath={() => ''}>
        <FeatureFlagProvider>
          <AvailableChannelsProvider>
            <StreamAPIProvider>
              <StreamSettingsProvider>
                <ChannelProvider>
                  <ChannelRouteProvider>
                    <StreamProvider>
                      <WidgetLayoutProvider>
                        <ActivityFeedSettingsProvider>
                          <AudienceInsightsSettingsProvider>
                            <ChatUserListSettingsProvider>
                              <WidgetMenuProvider>
                                <ExternalPopoutWrapper />
                              </WidgetMenuProvider>
                            </ChatUserListSettingsProvider>
                          </AudienceInsightsSettingsProvider>
                        </ActivityFeedSettingsProvider>
                      </WidgetLayoutProvider>
                    </StreamProvider>
                  </ChannelRouteProvider>
                </ChannelProvider>
              </StreamSettingsProvider>
            </StreamAPIProvider>
          </AvailableChannelsProvider>
        </FeatureFlagProvider>
      </SocialPackageProvider>
    </AuthenticatedUserProvider>
  );
}
