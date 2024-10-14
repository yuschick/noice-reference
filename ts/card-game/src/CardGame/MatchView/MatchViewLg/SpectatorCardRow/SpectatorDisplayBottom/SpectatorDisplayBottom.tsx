import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';

import styles from './SpectatorDisplayBottom.module.css';
import { SpectatorPlayerInfo } from './SpectatorPlayerInfo';

import { AnimatedBoosterScores, useAnimatedBoosterScore } from '@game-common/booster';
import { CardHighlightState } from '@game-common/card';
import { SpectatorDisplayBottomProfileFragment } from '@game-gen';
import { usePlayerScore } from '@game-logic/player/hooks';

export interface Props {
  player: SpectatorDisplayBottomProfileFragment;
  highlightState: Nullable<CardHighlightState>;
}

export function SpectatorDisplayBottom({ player, highlightState }: Props) {
  const [currentScore] = usePlayerScore(player.userId);

  const { animatedPlayerScore, scoreAnimationDuration, showBoosterLabels } =
    useAnimatedBoosterScore({ highlightState });

  // If there is a highlight state, we want to use the animated score
  // while the highlight is active, otherwise we use the current score
  const playerScore = animatedPlayerScore ?? currentScore;

  return (
    <div className={styles.bottomWrapper}>
      <div>
        {highlightState && showBoosterLabels && (
          <AnimatedBoosterScores
            classNames={{
              boosterScoreClassName: styles.boosterScore,
            }}
            highlightState={highlightState}
          />
        )}
      </div>

      <SpectatorPlayerInfo
        classNames={{ scoreAnimatingClassName: styles.scoreUpdateAnimation }}
        highlightStateType={highlightState?.type}
        player={player}
        score={playerScore}
        scoreAnimationDuration={scoreAnimationDuration}
      />
    </div>
  );
}

SpectatorDisplayBottom.Loading = function () {
  return (
    <div className={styles.bottomWrapper}>
      <SpectatorPlayerInfo.Loading />
    </div>
  );
};

SpectatorDisplayBottom.fragments = {
  entry: gql`
    fragment SpectatorDisplayBottomProfile on ProfileProfile {
      userId
      ...SpectatorPlayerInfoProfile
    }
    ${SpectatorPlayerInfo.fragments.entry}
  `,
};
