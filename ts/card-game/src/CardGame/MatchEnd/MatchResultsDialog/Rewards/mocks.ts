import { MatchEndedMsg } from '@noice-com/schemas/game-logic/game_logic.pb';

import { createMatchResultsDialogRewardsGameQueryMock } from './story-mocks';

interface MockMatchResultsDialogRewardsProps {
  matchEndMessage: MatchEndedMsg;
}

export const mockMatchResultsDialogRewards = ({
  matchEndMessage,
}: MockMatchResultsDialogRewardsProps) => {
  const { gameId } = matchEndMessage;

  if (!gameId) {
    return [];
  }

  return [createMatchResultsDialogRewardsGameQueryMock(gameId)];
};
