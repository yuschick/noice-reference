import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Pill, useContainerSize, useDialog } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useRef, useState } from 'react';

import type { StreamInformation } from '../hooks/useStreamInformation.hook';

import { Announcements } from './Announcements/Announcements';
import { DebugMenu } from './DebugMenu';
import { HelpMenu } from './HelpMenu';
import { useStreamSessionStartTime } from './hooks/useStreamSessionStartTime.hook';
import { ProfileMenu } from './ProfileMenu';
import { StatFollowers } from './Stats/StatFollowers';
import { StatSessionLength } from './Stats/StatSessionLength';
import { StatsPopover } from './Stats/StatsPopover';
import { StatSubscribers } from './Stats/StatSubscribers';
import { StatViewers } from './Stats/StatViewers';
import { StreamConnection } from './StreamConnection/StreamConnection';
import styles from './TopBar.module.css';
import { TopBarActivePage } from './TopBarActivePage/TopBarActivePage';
import { Stat } from './types';
import { getMatchStatus } from './utils';

import { PermissionWrapper } from '@common/permission';
import { ChannelRole } from '@common/profile';
import { Status } from '@common/status';
import { StatusText } from '@common/status/StatusText/StatusText';
import { useStreamContext } from '@common/stream';
import { WidgetSelectionModal } from '@common/widget';
import { TopBarChannelFragment } from '@gen';

interface TopBarProps {
  channel: Nullable<TopBarChannelFragment>;
  streamInformation: StreamInformation;
}

export function TopBar({ channel, streamInformation }: TopBarProps) {
  const [selectedStat, setSelectedStat] = useState<Stat>('sessionLength');
  const [showViewers, setShowViewers] = useState(true);
  const topBarContainerRef = useRef<HTMLDivElement>(null);

  const dialog = useDialog({ title: 'Select Your Widgets' });

  const context = useStreamContext();
  const matchStatus = getMatchStatus(context);
  const { streamId } = context;

  const { isRunning } = useStreamSessionStartTime({
    streamId,
    matchStatus: matchStatus.status,
  });

  const { inlineSize: topBarContainerSize } = useContainerSize(topBarContainerRef);

  return (
    <div
      className={styles.topBarContainer}
      ref={topBarContainerRef}
    >
      <div className={styles.topBarWrapper}>
        <TopBarActivePage
          topBarInlineSize={topBarContainerSize}
          onWidgetManagementSelect={dialog.actions.open}
        />

        <PermissionWrapper allowedRoles={[ChannelRole.Moderator]}>
          <div
            className={classNames(styles.streamStatsWrapper, {
              [styles.isOffline]: !isRunning,
            })}
          >
            <div
              className={styles.streamStat}
              data-selected-stat={selectedStat === 'sessionLength'}
            >
              <StatSessionLength />
            </div>

            <button
              className={classNames(styles.streamStat, styles.streamStatToggle)}
              data-selected-stat={selectedStat === 'viewers'}
              title={showViewers ? 'Hide viewers count' : 'Show viewers count'}
              type="button"
              onClick={() => {
                setShowViewers((prev) => !prev);
              }}
            >
              <StatViewers showViewers={showViewers} />
            </button>

            <div
              className={styles.streamStat}
              data-selected-stat={selectedStat === 'followers'}
            >
              <StatFollowers channel={channel} />
            </div>

            <div
              className={styles.streamStat}
              data-selected-stat={selectedStat === 'subscribers'}
            >
              <StatSubscribers channel={channel} />
            </div>

            {!!topBarContainerSize && topBarContainerSize < 983 && (
              <StatsPopover
                channel={channel}
                selectedStat={selectedStat}
                setSelectedStat={setSelectedStat}
              />
            )}
          </div>

          <div className={styles.streamStatusWrapper}>
            {!channel?.isPublic && (
              <Pill
                color="gradient-violet-magenta"
                iconEnd={CoreAssets.Icons.Hidden}
                label="Unlisted"
              />
            )}
            <div
              className={styles.streamStat}
              data-stream-status
            >
              <span className={styles.streamStatLabel}>Stream Status</span>
              <div className={styles.streamStatValue}>
                <StatusText
                  status={
                    streamInformation.mostSevereErrorOrWarning?.severity === 'error'
                      ? {
                          text: 'Error',
                          status: Status.Error,
                        }
                      : matchStatus
                  }
                  warning={streamInformation.mostSevereErrorOrWarning?.content}
                />
              </div>
            </div>

            {!!streamId && <StreamConnection streamInformation={streamInformation} />}
          </div>
        </PermissionWrapper>

        <div className={styles.userMenusWrapper}>
          <div className={styles.topBarResponsiveUserMenu}>
            <HelpMenu />
          </div>

          <Announcements />

          <div className={styles.topBarResponsiveUserMenu}>
            <DebugMenu />
          </div>
        </div>

        <ProfileMenu />
      </div>
      <WidgetSelectionModal dialog={dialog} />
    </div>
  );
}

TopBar.fragments = {
  entry: gql`
    fragment TopBarChannel on ChannelChannel {
      subscriberCount
      followerCount
      isPublic
    }
  `,
};
