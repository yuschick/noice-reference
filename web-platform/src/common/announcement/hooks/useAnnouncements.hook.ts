import { gql } from '@apollo/client';
import { PlatformAnnouncementsModal, useAuthentication } from '@noice-com/common-ui';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import { useListenAppLocalStorageValue } from '@common/localstorage';
import { Routes } from '@common/route';
import { PlatformAnnouncementFragment, useUserAnnouncementsLazyQuery } from '@gen';

interface HookResult {
  announcements: PlatformAnnouncementFragment[];
  isModalOpen: boolean;
  onModalClose(): void;
}

gql`
  query UserAnnouncements($userId: ID!) {
    userAnnouncements(userId: $userId, target: ANNOUNCEMENT_TARGET_WEB) {
      announcements {
        id
        ...PlatformAnnouncement
      }
    }
  }
  ${PlatformAnnouncementsModal.fragments.entry}
`;

export function useAnnouncements(): HookResult {
  const { userId } = useAuthentication();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<PlatformAnnouncementFragment[]>([]);
  const [seenAnnouncements, setSeenAnnouncements] =
    useListenAppLocalStorageValue('announcements.seen');

  const [fetchAnnouncements] = useUserAnnouncementsLazyQuery({
    onCompleted(data) {
      // Do nothing if no active announcements
      if (!data?.userAnnouncements?.announcements.length) {
        return;
      }

      // Get all unseen announcements
      const announcements = data.userAnnouncements.announcements.filter(
        (announcement) => !seenAnnouncements.includes(announcement.id),
      );

      // Do nothing if no unseen announcements
      if (!announcements.length) {
        return;
      }

      // Set unseen announcements to modal data and show modal
      setAnnouncements(announcements);
      setIsModalOpen(true);
    },
  });

  useEffect(() => {
    if (!userId) {
      return;
    }

    // Fetch announcement only at home or when user has just logged in
    if (location.pathname !== Routes.Home && !location.state?.loggedIn) {
      return;
    }

    fetchAnnouncements({ variables: { userId } });
  }, [fetchAnnouncements, location, userId]);

  const onModalClose = () => {
    setIsModalOpen(false);

    // Add modal announcements to seen announcements when modal is closed
    setSeenAnnouncements([
      ...seenAnnouncements,
      ...announcements.map((announcement) => announcement.id),
    ]);
  };

  return { announcements, isModalOpen, onModalClose };
}
