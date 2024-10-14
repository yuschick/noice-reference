import { usePlaySound } from '@social-hooks';
import { SocialSoundKeys } from '@social-types';

interface HookResult {
  playButtonHoverSound: () => void;
  playButtonClickSound: () => void;
}

export const useFriendSidebarSounds = (): HookResult => {
  const [playButtonHoverSound] = usePlaySound(SocialSoundKeys.GenericHover);
  const [playButtonClickSound] = usePlaySound(SocialSoundKeys.ButtonClickConfirm);

  return {
    playButtonHoverSound,
    playButtonClickSound,
  };
};
