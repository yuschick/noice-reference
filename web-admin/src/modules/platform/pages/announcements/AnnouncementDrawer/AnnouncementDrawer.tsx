import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';

import { AnnouncementCreateForm } from '../AnnouncementCreateForm/AnnouncementCreateForm';
import { AnnouncementEditForm } from '../AnnouncementEditForm/AnnouncementEditForm';

import { AnnouncementDrawerAnnouncementFragment } from '@gen';

interface Props {
  announcement: Nullable<AnnouncementDrawerAnnouncementFragment>;
  onMutationCompleted(): void;
}

export function AnnouncementDrawer({ announcement, onMutationCompleted }: Props) {
  if (announcement) {
    return (
      <AnnouncementEditForm
        announcement={announcement}
        onDeleteCompleted={onMutationCompleted}
      />
    );
  }

  return <AnnouncementCreateForm />;
}

AnnouncementDrawer.fragments = {
  entry: gql`
    fragment AnnouncementDrawerAnnouncement on AnnouncementAnnouncement {
      id
      ...AnnouncementEditFormAnnouncement
    }
  `,
};
