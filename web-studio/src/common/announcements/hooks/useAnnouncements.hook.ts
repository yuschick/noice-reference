import { gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { useState } from 'react';

import { useListenStudioLocalStorageValue } from '@common/local-storage';
import { PlatformAnnouncementFragment, useUserAnnouncementsQuery } from '@gen';

interface HookResult {
  announcements: PlatformAnnouncementFragment[];
  isModalOpen: boolean;
  onModalClose(): void;
}

gql`
  query UserAnnouncements($userId: ID!) {
    userAnnouncements(userId: $userId, target: ANNOUNCEMENT_TARGET_STUDIO) {
      announcements {
        id
        ...PlatformAnnouncement
      }
    }
  }
`;

export function useAnnouncements(): HookResult {
  const { userId } = useAuthenticatedUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<PlatformAnnouncementFragment[]>([]);
  const [seenAnnouncements, setSeenAnnouncements] =
    useListenStudioLocalStorageValue('announcements.seen');

  useUserAnnouncementsQuery({
    variables: { userId },
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
    pollInterval: 100 * 60 * 10,
  });

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
