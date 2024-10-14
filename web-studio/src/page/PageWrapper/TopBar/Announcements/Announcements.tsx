import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  useAuthenticatedUser,
  PlatformAnnouncementsModal,
  usePopoverMenu,
  PopoverMenu,
  IconButton,
} from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import styles from './Announcements.module.css';
import { SidebarAnnouncements } from './SidebarAnnouncements/SidebarAnnouncements';

import { useSidebarAnnouncementsLazyQuery } from '@gen';

gql`
  query SidebarAnnouncements($userId: ID!) {
    userAnnouncements(userId: $userId, target: ANNOUNCEMENT_TARGET_STUDIO) {
      announcements {
        id
        ...SidebarAnnouncement
        ...PlatformAnnouncement
      }
    }
  }
`;

export function Announcements() {
  const popover = usePopoverMenu({ placement: 'bottom' });
  const { toggle } = popover.actions;

  const { userId } = useAuthenticatedUser();

  const [activeAnnouncement, setActiveAnnouncement] = useState<Nullable<string>>(null);

  const [fetchAnnouncements, { data }] = useSidebarAnnouncementsLazyQuery();

  useEffect(() => {
    if (!popover.state.popoverMenuIsOpen) {
      return;
    }

    fetchAnnouncements({ variables: { userId } });
  }, [fetchAnnouncements, popover.state.popoverMenuIsOpen, userId]);

  const modalData = activeAnnouncement
    ? data?.userAnnouncements?.announcements.find(
        (announcement) => announcement.id === activeAnnouncement,
      )
    : undefined;

  const onNotificationClick = (id: string) => {
    setActiveAnnouncement(id);
    toggle();
  };

  const announcements = data?.userAnnouncements?.announcements ?? [];

  return (
    <div className={styles.wrapper}>
      <IconButton
        icon={CoreAssets.Icons.Notification}
        label="Announcements"
        ref={popover.state.popoverMenuTriggerRef}
        size="sm"
        variant="ghost"
        onClick={toggle}
      />

      <PopoverMenu store={popover}>
        <div className={styles.panel}>
          {announcements.length ? (
            <SidebarAnnouncements
              announcements={announcements}
              onNotificationClick={onNotificationClick}
            />
          ) : (
            <span>No announcements</span>
          )}
        </div>
      </PopoverMenu>

      <PlatformAnnouncementsModal
        announcements={modalData ? [modalData] : []}
        isOpen={!!activeAnnouncement}
        onClose={() => setActiveAnnouncement(null)}
      />
    </div>
  );
}
