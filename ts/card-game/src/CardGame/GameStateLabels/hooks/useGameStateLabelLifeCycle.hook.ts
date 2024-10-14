import { useToggle } from '@noice-com/common-ui';
import { useEffect } from 'react';

interface Props {
  hideContent?: boolean;
}

interface HookResult {
  isShowing: boolean;
  triggerShowLabel: () => void;
  reset: () => void;
}

/**
 * This is helper hook to handle lifecycle of "game on", "match paused",
 * "match resumed" etc. messages shown by GameStateLabel component.
 */
export function useGameStateLabelLifeCycle({ hideContent }: Props): HookResult {
  const [showLabel, _, triggerShowLabel, reset] = useToggle(false);

  // hide label if hideContent is true
  useEffect(() => {
    if (!hideContent || !showLabel) {
      return;
    }

    reset();
  }, [hideContent, showLabel, reset]);

  return {
    isShowing: showLabel,
    triggerShowLabel,
    reset,
  };
}
