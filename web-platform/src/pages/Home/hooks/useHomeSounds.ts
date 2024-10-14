import { usePlaySound, AppSoundKeys } from '@common/sound';

interface HookResult {
  playDailyGoalsWidgetHoverSound: () => void;
  playDailyGoalsWidgetClickSound: () => void;
  playLoadMoreChannelsHoverSound: () => void;
  playLoadMoreChannelsClickSound: () => void;
}

export const useHomeSounds = (): HookResult => {
  const [playGenericHoverSound] = usePlaySound(AppSoundKeys.GenericHover);
  const [playButtonClickConfirm] = usePlaySound(AppSoundKeys.ButtonClickConfirm);

  return {
    playDailyGoalsWidgetHoverSound: playGenericHoverSound,
    playDailyGoalsWidgetClickSound: playButtonClickConfirm,
    playLoadMoreChannelsHoverSound: playGenericHoverSound,
    playLoadMoreChannelsClickSound: playButtonClickConfirm,
  };
};
