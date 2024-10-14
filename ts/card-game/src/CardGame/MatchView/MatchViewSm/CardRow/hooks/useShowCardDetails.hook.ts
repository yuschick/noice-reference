import { useOnOutsideClick, useToggle } from '@noice-com/common-ui';
import { useEffect, useRef } from 'react';

import { usePlayerActiveCard } from '@game-logic/card/hooks';
import { useIsMatchPaused } from '@game-logic/game/hooks';
import { useCardGamePlayer } from '@game-logic/player/hooks';

interface HookResult {
  activeCardRef: React.RefObject<HTMLDivElement>;
  showDetails: boolean;
  toggleShowDetails: () => void;
}

export function useShowCardDetails(playerId: string): HookResult {
  const activeCard = usePlayerActiveCard(playerId);
  const player = useCardGamePlayer(playerId);
  const isMatchPaused = useIsMatchPaused();

  const activeCardRef = useRef<HTMLDivElement>(null);

  const [showDetails, toggleShowDetails, _, closeShowDetails] = useToggle(false);

  useOnOutsideClick(activeCardRef, toggleShowDetails, { condition: showDetails });

  // Close show details if no active card or match is paused
  useEffect(() => {
    if (activeCard && !isMatchPaused) {
      return;
    }

    closeShowDetails();
  }, [activeCard, isMatchPaused, closeShowDetails]);

  // If player removed, close show details
  useEffect(() => {
    if (!player) {
      return;
    }

    player.addListener('onRemoved', closeShowDetails);

    return () => {
      player.removeListener('onRemoved', closeShowDetails);
    };
  }, [player, closeShowDetails]);

  return {
    activeCardRef,
    showDetails,
    toggleShowDetails,
  };
}
