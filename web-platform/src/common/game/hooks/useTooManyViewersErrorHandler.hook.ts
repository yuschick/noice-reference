import { useCallback } from 'react';

import { useStreamGame } from '@common/stream';

export function useTooManyViewersErrorHandler() {
  const { leaveGame } = useStreamGame();

  const onTooManyViewersErrorCallback = useCallback(() => {
    leaveGame();
  }, [leaveGame]);

  return { onTooManyViewersErrorCallback };
}
