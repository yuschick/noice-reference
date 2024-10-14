import { MatchEndedMsg } from '@noice-com/schemas/game-logic/game_logic.pb';

import {
  createMatchResultsDialogBestPlaysGameCardsQueryMock,
  createMatchResultsDialogBestPlaysProfilesQueryMock,
} from './story-mocks';

export const mockMatchResultsDialogBestPlays = (props: {
  matchEndMessage: MatchEndedMsg;
}) => {
  const { players } = props.matchEndMessage;

  if (!players?.length) {
    return [];
  }

  return [
    createMatchResultsDialogBestPlaysProfilesQueryMock(players),
    createMatchResultsDialogBestPlaysGameCardsQueryMock(players),
  ];
};
