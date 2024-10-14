import { gql } from '@apollo/client';

import { AnnouncementTabPage } from '../../AnnouncementTabPage';

import { ActiveAnnouncementsQuery, useActiveAnnouncementsQuery } from '@gen';

gql`
  query ActiveAnnouncements($cursor: APICursorInput) {
    announcements(cursor: $cursor, filter: { statuses: [ANNOUNCEMENT_STATUS_ACTIVE] }) {
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
      announcements {
        id
        ...AnnouncementTableAnnouncement
        ...AnnouncementDrawerAnnouncement
      }
    }
  }
`;

export function ActiveAnnouncements() {
  return (
    <AnnouncementTabPage<ActiveAnnouncementsQuery> hook={useActiveAnnouncementsQuery} />
  );
}
