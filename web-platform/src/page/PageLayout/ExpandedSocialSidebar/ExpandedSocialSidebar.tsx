import { CoreAssets } from '@noice-com/assets-core';
import { IconButton } from '@noice-com/common-ui';
import {
  FriendsSidebarContent,
  FriendsSidebarMenu,
  FriendsView,
} from '@noice-com/social';
import { CSSProperties } from 'react';

import { SidebarOverlay } from '../SidebarOverlay';
import { EXPANDED_SOCIAL_SIDEBAR_ID } from '../utils';

import styles from './ExpandedSocialSidebar.module.css';

import SidebarBackground from '@assets/images/background-stream-semi-transparent.webp';
import { useStreamGame } from '@common/stream';

interface Props {
  selectedFriendsView: FriendsView;
  isExpanded: boolean;
  onCollapse(): void;
  onSelectFriendsView(view: FriendsView): void;
}

export function ExpandedSocialSidebar({
  selectedFriendsView,
  isExpanded,
  onCollapse,
  onSelectFriendsView,
}: Props) {
  const { streamId } = useStreamGame();

  return (
    <SidebarOverlay
      className={styles.overlayContent}
      isExpanded={isExpanded}
      position="end"
      onCollapse={onCollapse}
    >
      <aside
        className={styles.sidebarWrapper}
        style={
          {
            '--sidebar-background': `url(${SidebarBackground})`,
          } as CSSProperties
        }
      >
        <section
          className={styles.wrapper}
          id={EXPANDED_SOCIAL_SIDEBAR_ID}
        >
          <div className={styles.headerWrapper}>
            <FriendsSidebarMenu
              selectedFriendsView={selectedFriendsView}
              onSelectFriendsView={onSelectFriendsView}
            />

            <h1 className={styles.title}>{selectedFriendsView}</h1>

            <IconButton
              aria-controls={EXPANDED_SOCIAL_SIDEBAR_ID}
              aria-expanded={isExpanded ? 'true' : 'false'}
              icon={CoreAssets.Icons.Close}
              label="Collapse"
              level="secondary"
              shape="sharp"
              size="lg"
              onClick={onCollapse}
            />
          </div>

          <div
            className={styles.contentWrapper}
            data-autofocus-inside
          >
            <FriendsSidebarContent
              isInStream={!!streamId}
              selectedView={selectedFriendsView}
              onSelectView={onSelectFriendsView}
            />
          </div>
        </section>
      </aside>
    </SidebarOverlay>
  );
}
