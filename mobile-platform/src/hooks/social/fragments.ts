import { gql } from '@apollo/client';

gql`
  fragment FriendStatusUpdateProfile on ProfileProfile {
    userId
    friendshipStatus {
      status
    }
    onlineStatus
  }
`;
