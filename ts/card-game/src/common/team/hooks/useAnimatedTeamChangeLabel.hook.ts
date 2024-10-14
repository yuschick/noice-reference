import { useAnimatedNumber } from '@noice-com/common-ui';

import { useTimeLeftForTeamChange } from './useTimeLeftForTeamChange.hook';

interface HookResult {
  label: string;
  isAnimating: boolean;
}

export function useAnimatedTeamChangeLabel(text: string): HookResult {
  const timeLeft = useTimeLeftForTeamChange();

  const timeLeftSeconds = timeLeft > 0 ? Math.floor(timeLeft / 1000) : 0;

  const { value, isAnimating } = useAnimatedNumber({
    initialValue: timeLeftSeconds,
    target: 0,
    duration: timeLeft,
    prefix: `${text} (`,
    suffix: ' sec)',
  });

  return {
    label: isAnimating ? value : text,
    isAnimating,
  };
}
