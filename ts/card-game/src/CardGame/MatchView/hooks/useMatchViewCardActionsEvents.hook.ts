import { useAuthenticatedUser } from '@noice-com/common-ui';
import { useEffect } from 'react';

import { useCardGameUIState } from '@game-context';
import { usePlayerActiveCard } from '@game-logic/card/hooks';

export function useMatchViewCardActionsEvents(): boolean {
  const { userId } = useAuthenticatedUser();
  const activeCard = usePlayerActiveCard(userId);
  const { closeCardSelect } = useCardGameUIState();

  useEffect(() => {
    if (!activeCard) {
      return;
    }

    activeCard?.addListener('onSucceeded', closeCardSelect);
    activeCard?.addListener('onFailed', closeCardSelect);

    return () => {
      activeCard?.removeListener('onSucceeded', closeCardSelect);
      activeCard?.removeListener('onFailed', closeCardSelect);
    };
  }, [activeCard, closeCardSelect]);

  return true;
}
