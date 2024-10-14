import { gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useState } from 'react';

import {
  UseDefaultGameIdProfileGameFragment,
  useUseDefaultGameIdProfileQuery,
} from '@gen';

gql`
  fragment UseDefaultGameIdProfileGame on ProfilePlayedGame {
    id
    lastPlayedAt
  }

  query UseDefaultGameIdProfile($userId: ID) {
    profile(userId: $userId) {
      userId
      playedGames {
        userId
        id
        ...UseDefaultGameIdProfileGame
      }
    }
  }
`;

interface HookResult {
  gameId: Nullable<string>;
  loading: boolean;
}

export function useDefaultGameId(): HookResult {
  const { userId } = useAuthenticatedUser();
  const [gameId, setGameId] = useState<Nullable<string>>(null);

  const { loading } = useUseDefaultGameIdProfileQuery({
    variables: { userId },
    onCompleted(data) {
      if (!data.profile?.playedGames.length) {
        return;
      }

      const defaultGame: Nullable<UseDefaultGameIdProfileGameFragment> =
        data.profile.playedGames.reduce((prev, current) =>
          new Date(prev.lastPlayedAt).getTime() > new Date(current.lastPlayedAt).getTime()
            ? prev
            : current,
        );

      setGameId(defaultGame?.id ?? null);
    },
    fetchPolicy: 'cache-and-network',
  });

  return { gameId, loading };
}
