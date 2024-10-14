import { gql } from '@apollo/client';

import { AnnouncementTabPage } from '../../AnnouncementTabPage';

import { DraftAnnouncementsQuery, useDraftAnnouncementsQuery } from '@gen';

gql`
  query DraftAnnouncements($cursor: APICursorInput) {
    announcements(cursor: $cursor, filter: { statuses: [ANNOUNCEMENT_STATUS_DRAFT] }) {
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

export function DraftAnnouncements() {
  return (
    <AnnouncementTabPage<DraftAnnouncementsQuery> hook={useDraftAnnouncementsQuery} />
  );
}
