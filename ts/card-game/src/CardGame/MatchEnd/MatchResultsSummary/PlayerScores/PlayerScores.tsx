import { gql } from '@apollo/client';
import { MatchEndedMsg } from '@noice-com/schemas/game-logic/game_logic.pb';

import { getPlayerIdsFromMatchEnd } from '../../utils';
import { PlayerScore } from '../PlayerScore/PlayerScore';

import styles from './PlayerScores.module.css';

import { useMatchResultsSummaryPlayerScoresProfileQuery } from '@game-gen';

gql`
  query MatchResultsSummaryPlayerScoresProfile($userIds: [String!]) {
    profileBatch(userIds: $userIds) {
      profiles {
        userId
        ...MatchResultsSummaryPlayerScoreProfile
      }
    }
  }
`;

function getPlayerScore(userId: string, matchEndMessage: MatchEndedMsg) {
  return (
    matchEndMessage.players?.find((matchEndPlayer) => matchEndPlayer.userId === userId)
      ?.points ?? 0
  );
}

interface Props {
  matchEndMessage: MatchEndedMsg;
}

export function PlayerScores({ matchEndMessage }: Props) {
  const userIds = getPlayerIdsFromMatchEnd(matchEndMessage);

  const { data: profileData } = useMatchResultsSummaryPlayerScoresProfileQuery({
    variables: { userIds },
    skip: !userIds.length,
  });

  return (
    <div className={styles.matchResultsSummaryPlayersContainer}>
      {profileData?.profileBatch?.profiles.map((player) => (
        <PlayerScore
          key={player.userId}
          player={player}
          score={getPlayerScore(player.userId, matchEndMessage)}
        />
      ))}
    </div>
  );
}
