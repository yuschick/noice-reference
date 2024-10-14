import { usePlaySound, AppSoundKeys } from '@common/sound';

interface HookResult {
  playDailyGoalCardEmptySlotHoverSound: () => void;
  playDailyGoalCardHoverSound: () => void;
  playOpenDailyGoalCardSelectionSound: () => void;
  playDailyGoalCardSelectionReshuffleSound: () => void;
  playPickDailyGoalCardSound: () => void;
  playOpenDailyGoalCardSwitchSound: () => void;
  playDailyGoalCardSwitchCancelSound: () => void;
  playDailyGoalCardSwitchConfirmSound: () => void;
  playDailyGoalCollectSound: () => void;
  playDailyGoalCollectCoinsSound: () => void;
}

export const useDailyGoalSounds = (): HookResult => {
  const [playGenericHoverSound] = usePlaySound(AppSoundKeys.GenericHover);
  const [playMenuOpenSound] = usePlaySound(AppSoundKeys.MenuOpen);
  const [playButtonClickConfirmSound] = usePlaySound(AppSoundKeys.ButtonClickConfirm);
  const [playButtonClickCancelSound] = usePlaySound(AppSoundKeys.ButtonClickCancel);
  const [playCoinReward] = usePlaySound(AppSoundKeys.CurrencyCoinReward);

  return {
    playDailyGoalCardEmptySlotHoverSound: playGenericHoverSound,
    playDailyGoalCardHoverSound: playGenericHoverSound,
    playOpenDailyGoalCardSelectionSound: playMenuOpenSound,
    playDailyGoalCardSelectionReshuffleSound: playButtonClickConfirmSound,
    playPickDailyGoalCardSound: playButtonClickConfirmSound,
    playOpenDailyGoalCardSwitchSound: playMenuOpenSound,
    playDailyGoalCardSwitchCancelSound: playButtonClickCancelSound,
    playDailyGoalCardSwitchConfirmSound: playButtonClickConfirmSound,
    playDailyGoalCollectSound: playButtonClickConfirmSound,
    playDailyGoalCollectCoinsSound: playCoinReward,
  };
};
