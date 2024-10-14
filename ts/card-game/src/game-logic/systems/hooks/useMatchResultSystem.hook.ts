import { Nullable } from '@noice-com/utils';

import { useStreamGame } from '../../game/context';
import type { CGMatchResultSystem } from '../CGMatchResultSystem';

export function useMatchResultSystem(): Nullable<CGMatchResultSystem> {
  const { gameInstance } = useStreamGame();

  return gameInstance?.matchResultSystem ?? null;
}
