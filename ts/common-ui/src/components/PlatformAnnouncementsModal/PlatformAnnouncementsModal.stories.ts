import { PlatformAnnouncementsModal } from './PlatformAnnouncementsModal';

import { PlatformAnnouncementFragment } from '@common-gen';
import { getNewAnnouncement } from '@common-story-helpers';

export default {
  title: 'PlatformAnnouncementsModal',
  component: PlatformAnnouncementsModal,
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  args: {
    announcements: [getNewAnnouncement<PlatformAnnouncementFragment>()],
    isOpen: true,
  },
};

export const MultipleAnnouncements = {
  args: {
    ...Default.args,
    announcements: [
      getNewAnnouncement<PlatformAnnouncementFragment>(),
      getNewAnnouncement<PlatformAnnouncementFragment>(),
    ],
  },
};
