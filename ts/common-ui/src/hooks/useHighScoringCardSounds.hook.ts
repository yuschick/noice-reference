import { usePlaySound } from './usePlaySound.hook';

import { CommonSoundKeys } from '@common-types';

interface HookResult {
  playCardPromotedSound(): void;
}

export function useHighScoringCardSounds(): HookResult {
  const [playCardPromotedSound] = usePlaySound(
    CommonSoundKeys.ScoringCardSucceedsVariation,
  );

  return {
    playCardPromotedSound,
  };
}
