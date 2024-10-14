import { gql } from '@apollo/client';

import { AnnouncementTabPage } from '../../AnnouncementTabPage';

import { PastAnnouncementsQuery, usePastAnnouncementsQuery } from '@gen';

gql`
  query PastAnnouncements($cursor: APICursorInput) {
    announcements(cursor: $cursor, filter: { statuses: [ANNOUNCEMENT_STATUS_PAST] }) {
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

export function PastAnnouncements() {
  return <AnnouncementTabPage<PastAnnouncementsQuery> hook={usePastAnnouncementsQuery} />;
}
