import { gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';

import styles from './MatchGroupWaitingLg.module.css';

import { ChallengesButton } from '@game-common/challenges';
import { CardRowTeamInfoLg } from '@game-common/team';
import { CardRowAvatar } from '@game-components/CardRowAvatar';
import { useCardGameUIState } from '@game-context';
import { useMatchGroupWaitingLgPlayersQuery } from '@game-gen';
import { useTeamMates } from '@game-logic/group/hooks';

gql`
  query MatchGroupWaitingLgPlayers($playerIds: [String!]!) {
    profileBatch(userIds: $playerIds) {
      profiles {
        userId
        ...CardRowAvatarProfile
      }
    }
  }
`;

export function MatchGroupWaitingLg() {
  const { userId } = useAuthenticatedUser();
  const { teamPlayerIds } = useTeamMates();
  const { isChallengesDialogOpen } = useCardGameUIState();

  const playerIds = [userId, ...teamPlayerIds];

  const { data, loading } = useMatchGroupWaitingLgPlayersQuery({
    variables: {
      playerIds,
    },
  });

  if (isChallengesDialogOpen) {
    return;
  }

  return (
    <div className={styles.wrapper}>
      <ChallengesButton showSelectedIcon />

      {loading
        ? new Array(playerIds.length)
            .fill(null)
            .map((_, index) => <CardRowAvatar.Loading key={index} />)
        : data?.profileBatch?.profiles.map((player) => (
            <CardRowAvatar
              className={styles.player}
              key={player.userId}
              player={player}
            />
          ))}

      <CardRowTeamInfoLg className={styles.teamInfo} />
    </div>
  );
}
