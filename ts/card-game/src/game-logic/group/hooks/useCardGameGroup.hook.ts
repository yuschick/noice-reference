import { Nullable } from '@noice-com/utils';
import { useState, useEffect } from 'react';

import { useCardGameState } from '../../game/context';
import type { CGGroup } from '../CGGroup';

import { CardGameOnLocalGroupChanged } from '@game-logic/game';

/**
 * Use the local players current group.
 *
 * @todo Currently we can only have one, and we have to fully disconnect to
 * change groups. As this may change in the future, we may need to revisit.
 *
 * @returns The current group.
 */
export function useCardGameGroup(): CGGroup | null {
  const gameInstance = useCardGameState();
  const [group, setGroup] = useState<Nullable<CGGroup>>(null);

  useEffect(() => {
    if (!gameInstance) {
      return;
    }

    setGroup(gameInstance.getLocalGroup() ?? null);

    // Make sure we listen for the group changing.
    const listener = ({ group }: CardGameOnLocalGroupChanged) => {
      setGroup(group);
    };

    gameInstance.addListener('onLocalGroupChanged', listener);

    return () => {
      gameInstance.removeListener('onLocalGroupChanged', listener);
    };
  }, [gameInstance]);

  return group;
}
