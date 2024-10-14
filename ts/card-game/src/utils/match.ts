import { StreamStateMatchState } from '@noice-com/schemas/game-logic/game_logic.pb';

export function isMatchRunning(matchState: StreamStateMatchState) {
  return (
    matchState === StreamStateMatchState.MATCH_STATE_ACTIVE ||
    matchState === StreamStateMatchState.MATCH_STATE_PAUSED
  );
}
