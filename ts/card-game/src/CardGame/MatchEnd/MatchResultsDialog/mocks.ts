import { MatchEndedMsg } from '@noice-com/schemas/game-logic/game_logic.pb';

import { mockMatchResultsDialogBestPlays } from './BestPlays/mocks';
import { mockMatchResultsDialogPlayerScores } from './PlayerScores/mocks';
import { mockMatchResultsDialogRewards } from './Rewards/mocks';

interface MockMatchEndResultsDialogProps {
  matchEndMessage: MatchEndedMsg;
}

export const mockMatchEndResultsDialog = ({
  matchEndMessage,
}: MockMatchEndResultsDialogProps) => {
  return [
    ...mockMatchResultsDialogBestPlays({ matchEndMessage }),
    ...mockMatchResultsDialogRewards({ matchEndMessage }),
    ...mockMatchResultsDialogPlayerScores({ matchEndMessage }),
  ];
};
