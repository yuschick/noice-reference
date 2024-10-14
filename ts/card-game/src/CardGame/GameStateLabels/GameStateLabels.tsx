import { useShowMatchPaused, useShowMatchResumed, useShowMatchStarted } from './hooks';

import { GameStateLabel } from '@game-common/game/GameStateLabel/GameStateLabel';

interface Props {
  hideContent?: boolean;
}

export function GameStateLabels({ hideContent }: Props) {
  const { showMatchPaused, onMatchPausedCompleted } = useShowMatchPaused(hideContent);
  const { showMatchResumed, onMatchResumedCompleted } = useShowMatchResumed(hideContent);
  const { showMatchStarted, onMatchStartCompleted } = useShowMatchStarted(hideContent);

  if (hideContent) {
    return null;
  }

  return (
    <>
      {showMatchPaused && (
        <GameStateLabel
          title="Match Paused"
          onAnimationEnd={onMatchPausedCompleted}
        />
      )}
      {showMatchResumed && (
        <GameStateLabel
          title="Match Resuming"
          onAnimationEnd={onMatchResumedCompleted}
        />
      )}
      {showMatchStarted && (
        <GameStateLabel
          title="Game on"
          onAnimationEnd={onMatchStartCompleted}
        />
      )}
    </>
  );
}
