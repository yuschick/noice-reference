import { MatchEndedMsg } from '@noice-com/schemas/game-logic/game_logic.pb';

import { createMatchResultsDialogPlayerScoresProfilesQueryMock } from './story-mocks';

interface MockMatchResultsDialogPlayerScoresProps {
  matchEndMessage: MatchEndedMsg;
}

export const mockMatchResultsDialogPlayerScores = ({
  matchEndMessage,
}: MockMatchResultsDialogPlayerScoresProps) => {
  const { players } = matchEndMessage;

  if (!players?.length) {
    return [];
  }

  return [createMatchResultsDialogPlayerScoresProfilesQueryMock(players)];
};
