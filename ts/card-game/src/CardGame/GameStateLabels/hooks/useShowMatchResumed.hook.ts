import { useGameStateLabelLifeCycle } from './useGameStateLabelLifeCycle.hook';

import { useMatchPaused, useMatchResumed } from '@game-logic/game/hooks';

interface HookResult {
  showMatchResumed: boolean;
  onMatchResumedCompleted: () => void;
}

export function useShowMatchResumed(hideContent?: boolean): HookResult {
  const { isShowing, triggerShowLabel, reset } = useGameStateLabelLifeCycle({
    hideContent,
  });

  // Show the label when the match is resumed
  useMatchResumed(triggerShowLabel);

  // Reset the label shown state when the match is paused
  useMatchPaused(reset);

  return { showMatchResumed: isShowing, onMatchResumedCompleted: reset };
}
