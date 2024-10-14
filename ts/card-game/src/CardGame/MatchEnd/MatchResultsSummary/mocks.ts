import { MatchEndedMsg } from '@noice-com/schemas/game-logic/game_logic.pb';

import { mockPlayerScores } from './PlayerScores/mocks';

interface MockMatchResultsSummaryProps {
  matchEndMessage: MatchEndedMsg;
}

export const mockMatchResultsSummary = ({
  matchEndMessage,
}: MockMatchResultsSummaryProps) => {
  return [...mockPlayerScores({ matchEndMessage })];
};
