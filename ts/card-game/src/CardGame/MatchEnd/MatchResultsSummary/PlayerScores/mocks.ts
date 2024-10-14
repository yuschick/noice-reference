import { MatchEndedMsg } from '@noice-com/schemas/game-logic/game_logic.pb';

import { createMatchResultsSummaryPlayerScoresProfilesQueryMock } from './story-mocks';

interface MockPlayerScoresProps {
  matchEndMessage: MatchEndedMsg;
}

export const mockPlayerScores = ({ matchEndMessage }: MockPlayerScoresProps) => {
  const { players } = matchEndMessage;

  if (!players?.length) {
    return [];
  }

  return [createMatchResultsSummaryPlayerScoresProfilesQueryMock(players)];
};
