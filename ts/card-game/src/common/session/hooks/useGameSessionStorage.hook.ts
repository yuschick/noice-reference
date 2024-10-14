import { useSessionStorage } from '@noice-com/common-ui';

import { GameSessionDataKeys } from '@game-types';

export function useGameSessionStorage() {
  return useSessionStorage<GameSessionDataKeys>();
}
