import { Nullable } from '@noice-com/utils';

import { useStreamGame } from '../../game/context';
import { CGTeamCheerSystem } from '../CGTeamCheerSystem';

export function useTeamCheerSystem(): Nullable<CGTeamCheerSystem> {
  const { gameInstance } = useStreamGame();

  return gameInstance?.teamCheerSystem ?? null;
}
