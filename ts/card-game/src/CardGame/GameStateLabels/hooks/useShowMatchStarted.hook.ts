import { useGameStateLabelLifeCycle } from './useGameStateLabelLifeCycle.hook';

import {
  useMatchEnded,
  useMatchStarted,
  useRoundPhasePreparation,
} from '@game-logic/game/hooks';

interface HookResult {
  showMatchStarted: boolean;
  onMatchStartCompleted: () => void;
}

export function useShowMatchStarted(hideContent?: boolean): HookResult {
  const { isShowing, triggerShowLabel, reset } = useGameStateLabelLifeCycle({
    hideContent,
  });

  // We trigger the label when the match is started
  useMatchStarted(triggerShowLabel);

  // Reset the label shown state when the match is ended or round based games goes to preparation right away
  useMatchEnded(reset);
  useRoundPhasePreparation(reset);

  return { showMatchStarted: isShowing, onMatchStartCompleted: reset };
}
