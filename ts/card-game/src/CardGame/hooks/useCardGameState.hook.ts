import { usePreviousValue } from '@noice-com/common-ui';

import { useMatchState } from './useMatchState.hook';
import { useShowMatchEnd } from './useShowMatchEnd.hook';

import { isMatchRunning as isMatchRunningFunc } from '@game-utils';

interface Props {
  showMatchEnd?: boolean;
  hideContent?: boolean;
}

export function useCardGameState({ showMatchEnd: showMatchEndProp, hideContent }: Props) {
  const matchState = useMatchState();
  const previousState = usePreviousValue(matchState);

  const { showMatchEnd, showMatchEndCompleted, onMatchEndCompleted } = useShowMatchEnd({
    showMatchEnd: showMatchEndProp,
    hideContent,
  });

  const isMatchRunning = isMatchRunningFunc(matchState);
  const showWaitingForMatch =
    // Either we finished match end animation or player landed to stream between matches)
    (showMatchEndCompleted || !isMatchRunningFunc(previousState)) &&
    !isMatchRunning &&
    !showMatchEnd;

  return {
    state: {
      isMatchRunning,
      showWaitingForMatch,
      showMatchEnd,
    },
    onMatchEndCompleted,
  };
}
