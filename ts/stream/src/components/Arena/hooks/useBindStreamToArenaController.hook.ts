import { Nullable } from '@noice-com/utils';
import { useEffect } from 'react';

import { ArenaController } from '../classes/ArenaController';

interface Props {
  arenaController: Nullable<ArenaController>;
  stream: Nullable<MediaStream>;
}

export function useBindStreamToArenaController({ arenaController, stream }: Props) {
  useEffect(() => {
    arenaController?.setMediaStream(stream);
  }, [arenaController, stream]);
}
