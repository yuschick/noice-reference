import { StoryHelpers } from '@noice-com/common-ui';
import { Meta } from '@storybook/react';

import { BestPlays } from './BestPlays';
import { mockBestPlays } from './mocks';

import { GameInitBuilder, withGameState } from '@game-story-helpers';

const LOCAL_PLAYER_ID = 'me';
const LOCAL_PLAYER_CARD_ID = '1';
const TEAM_MATE_ID = 'team-mate';
const TEAM_MATE_CARD_ID = '2';

export default {
  title: 'MatchViewLg/Card Row/Best Plays',
  component: BestPlays,
  argTypes: {},
} as Meta<typeof BestPlays>;

export const Default = {
  args: {},

  decorators: [
    withGameState(
      undefined,
      new GameInitBuilder()
        .withGroupId('Example group')
        .withGroupName('Best Group')
        .withGroupScore(500)
        .withLocalPlayer({
          userName: 'Player 1',
          userId: 'me',
          bestPlay: {
            cardId: '1',
            points: 5000,
          },
        })
        .withTeamMate({
          userName: 'Player 1',
          userId: 'team-mate',
          bestPlay: {
            cardId: '2',
            points: 2500,
          },
        })
        .result(),
    ),
  ],

  parameters: StoryHelpers.Apollo.addMocks(
    mockBestPlays({
      userIds: [LOCAL_PLAYER_ID, TEAM_MATE_ID],
      cardIds: [LOCAL_PLAYER_CARD_ID, TEAM_MATE_CARD_ID],
    }),
  ),
};
