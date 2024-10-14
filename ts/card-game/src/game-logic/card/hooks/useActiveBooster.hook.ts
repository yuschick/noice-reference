import { useEffect, useState } from 'react';

import type { CGActiveBooster } from '../../boosters';
import { useCardGamePlayer } from '../../player/hooks/useCardGamePlayer.hook';
import {
  CGActiveCardOnBoosterAdded,
  CGActiveCardOnBoosterRemoved,
  CGActiveCardOnBoosterReplaced,
} from '../types';

import { usePlayerActiveCard } from './usePlayerActiveCard.hook';

export function useActiveBooster(
  cardOwnerId: string,
  playerId: string,
): CGActiveBooster | undefined {
  const card = usePlayerActiveCard(cardOwnerId);
  const player = useCardGamePlayer(cardOwnerId);
  const [booster, setBooster] = useState<CGActiveBooster | undefined>(
    card?.getPlayerActiveBooster(playerId),
  );

  useEffect(() => {
    if (!card || !player) {
      return;
    }

    // Make sure we store the booster whenever card changes.
    setBooster(card.getPlayerActiveBooster(playerId));

    // We just get the latest state because it's easier to maintain the booster order.
    const onAdded = ({ booster, boosterOwnerId }: CGActiveCardOnBoosterAdded) => {
      if (boosterOwnerId !== playerId) {
        return;
      }

      setBooster(booster);
    };

    const onReplaced = ({ booster, boosterOwnerId }: CGActiveCardOnBoosterReplaced) => {
      if (boosterOwnerId !== playerId) {
        return;
      }

      setBooster(booster);
    };

    const onRemoved = ({ boosterOwnerId }: CGActiveCardOnBoosterRemoved) => {
      if (boosterOwnerId !== playerId) {
        return;
      }

      setBooster(undefined);
    };

    const clear = () => {
      setBooster(undefined);
    };

    card.addListener('onBoosterAdded', onAdded);
    card.addListener('onBoosterReplaced', onReplaced);
    card.addListener('onBoosterRemoved', onRemoved);
    player.addListener('onCardSelected', clear);

    return () => {
      card.removeListener('onBoosterAdded', onAdded);
      card.removeListener('onBoosterReplaced', onReplaced);
      card.removeListener('onBoosterRemoved', onRemoved);
      player.removeListener('onCardSelected', clear);
    };
  }, [card, player, playerId]);

  return booster;
}
