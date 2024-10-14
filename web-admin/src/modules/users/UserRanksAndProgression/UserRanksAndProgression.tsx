import { gql } from '@apollo/client';
import { useParams } from 'react-router';

import { QueryTableModulePage } from '@common/page-components';
import {
  UserProgressionsQuery,
  UserProgressionsQueryVariables,
  useUserProgressionsQuery,
} from '@gen';

gql`
  query UserProgressions($userId: ID) {
    profile(userId: $userId) {
      userTag
      userId
      playedGames {
        id
        userId
        progression {
          level
        }
        season {
          id
          name
        }
        game {
          id
          name
        }
      }
    }
  }
`;

export function UserRanksAndProgression() {
  const { userId } = useParams();
  const queryResult = useUserProgressionsQuery({
    variables: {
      userId,
    },
    skip: !userId,
  });

  const dataTransform = (data: UserProgressionsQuery) => {
    return (
      data.profile?.playedGames.map((playedGame) =>
        (({ game, progression, season }) => ({
          gameTitle: `${game.name} - ${season.name}`,
          rank: progression.level,
        }))(playedGame),
      ) || []
    );
  };

  return (
    <QueryTableModulePage<UserProgressionsQuery, UserProgressionsQueryVariables>
      caption={`${queryResult.data?.profile?.userTag} game progressions`}
      dataTransform={dataTransform}
      queryResult={queryResult}
    />
  );
}
