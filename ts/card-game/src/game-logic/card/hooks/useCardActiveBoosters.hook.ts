import { useEffect, useState } from 'react';

import type { CGActiveBooster } from '../../boosters';
import { useLocalPlayerId } from '../../game/hooks';
import { useCardGamePlayer } from '../../player/hooks';

import { usePlayerActiveCard } from './usePlayerActiveCard.hook';

const getLocalPlayerBooster = (list: CGActiveBooster[], localPlayerId: string) =>
  list.find((booster) => booster.ownerId === localPlayerId) ?? null;

interface HookResult {
  localPlayerBooster: CGActiveBooster | null;
  teamMateBoosters: CGActiveBooster[];
  allBoosters: CGActiveBooster[];
}

export function useCardActiveBoosters(playerID: string): HookResult {
  const localPlayerId = useLocalPlayerId();
  const card = usePlayerActiveCard(playerID);
  const player = useCardGamePlayer(playerID);

  const initialBoosterList = card?.getActiveBoosters() ?? [];
  const [localPlayerBooster, setLocalPlayerBooster] = useState(() =>
    getLocalPlayerBooster(initialBoosterList, localPlayerId),
  );
  const [boosters, setBoosters] = useState<CGActiveBooster[]>(initialBoosterList);

  useEffect(() => {
    if (!card || !player) {
      return;
    }

    // We just get the latest state because it's easier to maintain the booster order.
    const onUpdated = () => {
      const newList = card.getActiveBoosters();

      let local: CGActiveBooster | null = null;
      const filteredList = newList.filter((booster) => {
        if (booster.givenById !== localPlayerId) {
          return true;
        }

        local = booster;
        return false;
      });

      setLocalPlayerBooster(local);
      setBoosters(filteredList);
    };

    const onRemoved = () => {
      setLocalPlayerBooster(null);
      setBoosters([]);
    };

    onUpdated();

    card.addListener('onBoosterAdded', onUpdated);
    card.addListener('onBoosterReplaced', onUpdated);
    card.addListener('onBoosterRemoved', onUpdated);
    player.addListener('onCardSelected', onRemoved);

    return () => {
      card.removeListener('onBoosterAdded', onUpdated);
      card.removeListener('onBoosterReplaced', onUpdated);
      card.removeListener('onBoosterRemoved', onUpdated);
      player.removeListener('onCardSelected', onRemoved);
    };
  }, [player, card, localPlayerId]);

  return {
    localPlayerBooster,
    teamMateBoosters: boosters,
    allBoosters: [localPlayerBooster, ...boosters].filter(Boolean) as CGActiveBooster[],
  };
}
