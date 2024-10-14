import { gql } from '@apollo/client';

import { AnnouncementTabPage } from '../../AnnouncementTabPage';

import { ScheduledAnnouncementsQuery, useScheduledAnnouncementsQuery } from '@gen';

gql`
  query ScheduledAnnouncements($cursor: APICursorInput) {
    announcements(
      cursor: $cursor
      filter: { statuses: [ANNOUNCEMENT_STATUS_SCHEDULED] }
    ) {
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

export function ScheduledAnnouncements() {
  return (
    <AnnouncementTabPage<ScheduledAnnouncementsQuery>
      hook={useScheduledAnnouncementsQuery}
    />
  );
}
