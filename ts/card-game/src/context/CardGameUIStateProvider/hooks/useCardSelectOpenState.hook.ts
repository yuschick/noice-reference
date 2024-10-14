import { AnalyticsEventClientCardSelectOpenedCardSelectOpenedContext as CardSelectOpenedContext } from '@noice-com/schemas/analytics/analytics.pb';
import { useCallback, useState } from 'react';

import { useCardGameAPIInternal } from '../../CardGameAPIProvider';

import { useHandleAutoCloseCardSelect } from './useHandleAutoCloseCardSelect.hook';

import { useGameAnalytics } from '@game-common/analytics/hooks';
import { usePlaySound } from '@game-common/sound/hooks';
import { GameSoundKeys } from '@game-types';

interface HookResult {
  isCardSelectOpen: boolean;
  openCardSelect(context: CardSelectOpenedContext): void;
  closeCardSelect(): void;
}

interface Props {
  hideContent?: boolean;
}

export function useCardSelectOpenState({ hideContent }: Props): HookResult {
  const [isCardSelectOpen, setCardSelectOpen] = useState(false);

  const { emitAPIEvent } = useCardGameAPIInternal();
  const [playMenuOpen] = usePlaySound(GameSoundKeys.MenuOpen);
  const [playMenuClose] = usePlaySound(GameSoundKeys.MenuClose);

  const { sendOpenCardSelectEvent } = useGameAnalytics();

  const openCardSelect = useCallback(
    (context: CardSelectOpenedContext) => {
      playMenuOpen();
      setCardSelectOpen(true);
      sendOpenCardSelectEvent(context);
      emitAPIEvent('onToggleCardSelect', true);
    },
    [playMenuOpen, sendOpenCardSelectEvent, emitAPIEvent],
  );

  const closeCardSelect = useCallback(() => {
    playMenuClose();
    setCardSelectOpen(false);
    emitAPIEvent('onToggleCardSelect', false);
  }, [playMenuClose, emitAPIEvent]);

  useHandleAutoCloseCardSelect({
    hideContent,
    closeCardSelect,
  });

  return {
    isCardSelectOpen,
    openCardSelect,
    closeCardSelect,
  };
}
