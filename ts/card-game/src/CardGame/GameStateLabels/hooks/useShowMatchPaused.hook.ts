import { useGameStateLabelLifeCycle } from './useGameStateLabelLifeCycle.hook';

import {
  useMatchPaused,
  useMatchResumed,
  useRoundPhasePreparation,
} from '@game-logic/game/hooks';

interface HookResult {
  showMatchPaused: boolean;
  onMatchPausedCompleted: () => void;
}

export function useShowMatchPaused(hideContent?: boolean): HookResult {
  const { isShowing, triggerShowLabel, reset } = useGameStateLabelLifeCycle({
    hideContent,
  });

  // Show the label when the match is paused
  useMatchPaused(triggerShowLabel);

  // Reset the label shown state when the match is resumed
  useMatchResumed(reset);
  useRoundPhasePreparation(reset);

  return { showMatchPaused: isShowing, onMatchPausedCompleted: reset };
}
