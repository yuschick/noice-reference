import { useEffect } from 'react';

import { ArenaControllerType } from '../../types';

import { StreamProps } from '@stream-types';

interface Props {
  arenaController: ArenaControllerType;
  streamProps: StreamProps;
}

export function useLoadArenaEvent({ arenaController, streamProps }: Props) {
  useEffect(() => {
    if (!streamProps.arena.value || !arenaController) {
      return;
    }

    arenaController.loadArena(streamProps.arena.value);
  }, [streamProps.arena, arenaController]);
}
