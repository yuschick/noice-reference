import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useState } from 'react';

import { CGActiveCardOnBoosterAdded } from '@game-logic/card';
import { usePlayerActiveCard } from '@game-logic/card/hooks';
import { BoosterType } from '@game-types';

interface HookResult {
  appliedBoosterId: Nullable<BoosterType>;
  clearBoostersAppliedVfx: () => void;
}

export function useShowBoosterAppliedVfx(playerID: string): HookResult {
  const [appliedBoosterId, setAppliedBoosterId] = useState<Nullable<BoosterType>>(null);
  const card = usePlayerActiveCard(playerID);

  const clearBoostersAppliedVfx = useCallback(() => setAppliedBoosterId(null), []);

  useEffect(() => {
    if (!card) {
      setAppliedBoosterId(null);
      return;
    }

    const onUpdated = ({ booster }: CGActiveCardOnBoosterAdded) => {
      setAppliedBoosterId(booster.boosterId);
    };

    const onRemoved = () => {
      setAppliedBoosterId(null);
    };

    card.addListener('onBoosterAdded', onUpdated);
    card.addListener('onBoosterReplaced', onUpdated);
    card.addListener('onBoosterRemoved', onRemoved);

    return () => {
      card.removeListener('onBoosterAdded', onUpdated);
      card.removeListener('onBoosterReplaced', onUpdated);
      card.addListener('onBoosterRemoved', onRemoved);
    };
  }, [card]);

  return {
    appliedBoosterId,
    clearBoostersAppliedVfx,
  };
}
