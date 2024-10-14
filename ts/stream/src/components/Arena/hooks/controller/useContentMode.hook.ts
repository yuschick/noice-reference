import { useEffect } from 'react';

import { ArenaControllerType } from '../../types';

import { StreamProps } from '@stream-types';

interface Props {
  arenaController: ArenaControllerType;
  streamProps: StreamProps;
}

export function useContentMode({ arenaController, streamProps }: Props) {
  useEffect(() => {
    if (!streamProps.contentMode.value || !arenaController) {
      return;
    }

    arenaController.setContentMode(streamProps.contentMode.value);
  }, [streamProps.contentMode, arenaController]);
}
