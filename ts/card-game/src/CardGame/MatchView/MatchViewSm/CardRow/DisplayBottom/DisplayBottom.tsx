import { gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';

import styles from './DisplayBottom.module.css';
import { PlayerScore } from './PlayerScore';

import { AnimatedBoosterScores, useAnimatedBoosterScore } from '@game-common/booster';
import { CardHighlightState } from '@game-common/card';
import { CardRowAvatar } from '@game-components/CardRowAvatar';
import { useDisplayBottomSmPlayerQuery } from '@game-gen';
import { usePlayerScore } from '@game-logic/player/hooks';

gql`
  query DisplayBottomSmPlayer($playerId: ID!) {
    profile(userId: $playerId) {
      userId
      ...CardRowAvatarProfile
    }
  }
`;

export interface Props {
  playerId: string;
  isCardHovered: boolean;
  highlightState: Nullable<CardHighlightState>;
}

export function DisplayBottom({ playerId, highlightState, isCardHovered }: Props) {
  const { userId } = useAuthenticatedUser();
  const isLocalPlayer = userId === playerId;

  const [currentScore] = usePlayerScore(playerId);
  const showAvatar = !(isLocalPlayer || isCardHovered) && !highlightState;

  const { animatedPlayerScore, scoreAnimationDuration, showBoosterLabels } =
    useAnimatedBoosterScore({ highlightState });

  const { data, loading } = useDisplayBottomSmPlayerQuery({
    variables: {
      playerId,
    },
  });

  // If there is a highlight state, we want to use the animated score
  // while the highlight is active, otherwise we use the current score
  const playerScore = animatedPlayerScore ?? currentScore;

  return (
    <div
      className={classNames(styles.bottomWrapper, {
        [styles.showAvatar]: showAvatar,
      })}
    >
      {loading ? (
        <CardRowAvatar.Loading />
      ) : (
        !!data?.profile && (
          <CardRowAvatar
            className={styles.bottomAvatar}
            player={data.profile}
          />
        )
      )}

      {highlightState && showBoosterLabels && (
        <AnimatedBoosterScores
          classNames={{
            boosterScoreClassName: styles.boosterScore,
          }}
          highlightState={highlightState}
        />
      )}

      <PlayerScore
        classNames={{
          root: styles.bottomPlayerScore,
          scoreAnimatingClassName: styles.scoreUpdateAnimation,
        }}
        highlightStateType={highlightState?.type}
        isCardHovered={isCardHovered}
        playerId={playerId}
        score={playerScore}
        scoreAnimationDuration={scoreAnimationDuration}
      />
    </div>
  );
}
