import { gql } from '@apollo/client';
import { ProfileImage, useAuthenticatedUser } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './PlayerScore.module.css';

import { MatchResultsSummaryPlayerScoreProfileFragment } from '@game-gen';

gql`
  fragment MatchResultsSummaryPlayerScoreProfile on ProfileProfile {
    userId
    userTag
    ...ProfileImageProfile
  }

  ${ProfileImage.fragments.entry}
`;

interface Props {
  player: MatchResultsSummaryPlayerScoreProfileFragment;
  score: number;
}

export function PlayerScore({ player, score }: Props) {
  const { userId } = useAuthenticatedUser();

  return (
    <div className={styles.matchEndPlayerContainer}>
      <ProfileImage
        profile={player}
        size="xs"
      />
      <span
        className={classNames({
          [styles.localPlayerText]: userId === player.userId,
          [styles.otherPlayerText]: userId !== player.userId,
        })}
      >
        {player.userTag}
      </span>
      <span className={styles.scoreText}>{score}</span>
    </div>
  );
}
