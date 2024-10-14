import { gql } from '@apollo/client';
import { LeaderboardProvider } from '@noice-com/card-game';
import { useClient } from '@noice-com/common-react-core';
import { WithChildren } from '@noice-com/common-ui';

import { useSidebarState } from './hooks/useSidebarState.hook';
import { useStreamInformation } from './hooks/useStreamInformation.hook';
import { NavigationSidebar } from './NavigationSidebar/NavigationSidebar';
import styles from './PageWrapper.module.css';
import { StreamStatusBanner } from './StreamStatusBanner/StreamStatusBanner';
import { TopBar } from './TopBar/TopBar';

import { useChannelContext } from '@common/channel';
import { SidebarsStateProvider } from '@common/sidebar';
import { useStreamContext } from '@common/stream';
import { ToastNotifications } from '@common/toast';
import { WidgetLayoutProvider } from '@common/widget';
import { usePageWrapperChannelQuery } from '@gen';

gql`
  query PageWrapperChannel($channelId: ID!) {
    channel(id: $channelId) {
      ...NavigationSidebarChannel
      ...TopBarChannel
    }
  }
  ${NavigationSidebar.fragments.entry}
  ${TopBar.fragments.entry}
`;

export function PageWrapper({ children }: WithChildren) {
  const { navigationSidebarMode, onChangeNavigationSidebarMode } = useSidebarState();
  const { channelId } = useChannelContext();
  const { streamId } = useStreamContext();
  const client = useClient();

  const { data } = usePageWrapperChannelQuery({
    variables: {
      channelId,
    },
  });

  const streamInformation = useStreamInformation();

  const channel = data?.channel || null;

  return (
    <SidebarsStateProvider
      navigationSidebarMode={navigationSidebarMode}
      onChangeNavigationSidebarMode={onChangeNavigationSidebarMode}
    >
      <LeaderboardProvider
        client={client}
        streamId={streamId}
      >
        <WidgetLayoutProvider>
          <div className={styles.container}>
            <div className={styles.banner}>
              <StreamStatusBanner streamInformation={streamInformation} />
            </div>

            <NavigationSidebar
              channel={channel}
              className={styles.sidebar}
            />

            <div className={styles.header}>
              <TopBar
                channel={channel}
                streamInformation={streamInformation}
              />
            </div>

            <main className={styles.content}>{children}</main>

            <ToastNotifications />
          </div>
        </WidgetLayoutProvider>
      </LeaderboardProvider>
    </SidebarsStateProvider>
  );
}
