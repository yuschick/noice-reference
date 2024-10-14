import { gql } from '@apollo/client';

import { useUseGroupEventsPlayerProfileQuery } from '@gen';

gql`
  query useGroupEventsPlayerProfile($playerId: ID!) {
    profile(userId: $playerId) {
      userId
      userTag
      avatars {
        avatar2D
      }
      onlineStatus
      preferredColor
      ...ProfileImageProfile
    }
  }
`;
export function useGroupEventsPlayerProfile(playerId: string) {
  const { data } = useUseGroupEventsPlayerProfileQuery({
    variables: {
      playerId,
    },
  });

  return data?.profile;
}
