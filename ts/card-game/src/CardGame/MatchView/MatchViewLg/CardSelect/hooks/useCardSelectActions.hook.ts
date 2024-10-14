import { useAuthenticatedUser, useConversionEvents } from '@noice-com/common-ui';
import { useCallback } from 'react';

import { useGameAnalytics } from '@game-common/analytics/hooks';
import { usePlaySound } from '@game-common/sound/hooks';
import { useCardGameUIState } from '@game-context';
import { GameLogicCard } from '@game-gen';
import { useCardGamePlayer } from '@game-logic/player/hooks';
import { GameSoundKeys } from '@game-types';

type OnSelectCardArg = Pick<GameLogicCard, 'id'>;

interface HookResult {
  onSelectCard(card: OnSelectCardArg): Promise<void>;
  onClose(): void;
}

export function useCardSelectActions(): HookResult {
  const { sendGameCardPickedConversionEvent } = useConversionEvents();
  const { closeCardSelect } = useCardGameUIState();
  const { sendCancelCardSelectEvent } = useGameAnalytics();
  const [playCardSelected] = usePlaySound(GameSoundKeys.CardsSelect);

  const { userId } = useAuthenticatedUser();
  const player = useCardGamePlayer(userId);

  const onSelectCard = async (card: OnSelectCardArg) => {
    if (!player) {
      throw new Error('Trying to select an active card without a player');
    }

    playCardSelected();
    await player.setActiveCard(card.id);
    sendGameCardPickedConversionEvent({ contentId: card.id });
    closeCardSelect();
  };

  const onClose = useCallback(() => {
    closeCardSelect();
    sendCancelCardSelectEvent();
  }, [closeCardSelect, sendCancelCardSelectEvent]);

  return {
    onSelectCard,
    onClose,
  };
}
