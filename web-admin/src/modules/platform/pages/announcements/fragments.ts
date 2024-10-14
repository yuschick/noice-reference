import { gql } from '@apollo/client';

gql`
  fragment AnnouncementTableAnnouncement on AnnouncementAnnouncement {
    id
    title
    category
    startTime
    endTime
    status
    creator {
      userId
      ...UsernameTableCellProfile
    }
  }
`;
