import { MatchEndedMsg } from '@noice-com/schemas/game-logic/game_logic.pb';

import { mockMatchEndResultsDialog } from './MatchResultsDialog/mocks';
import { mockMatchResultsSummary } from './MatchResultsSummary/mocks';

interface MockMatchResultsSummaryProps {
  matchEndMessage: MatchEndedMsg;
}

export const mockMatchEnd = ({ matchEndMessage }: MockMatchResultsSummaryProps) => {
  return [
    ...mockMatchResultsSummary({ matchEndMessage }),
    ...mockMatchEndResultsDialog({ matchEndMessage }),
  ];
};
