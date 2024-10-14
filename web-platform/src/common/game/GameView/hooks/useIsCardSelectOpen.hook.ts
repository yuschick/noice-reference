import { useCardGameAPI } from '@noice-com/card-game';
import { useState, useLayoutEffect } from 'react';

export function useIsCardSelectOpen(): boolean {
  const { events } = useCardGameAPI();
  const [isCardSelectOpen, setCardSelectOpen] = useState(false);

  useLayoutEffect(() => {
    events.addListener('onToggleCardSelect', setCardSelectOpen);

    return () => {
      events.removeListener('onToggleCardSelect', setCardSelectOpen);
    };
  }, [events]);

  return isCardSelectOpen;
}
