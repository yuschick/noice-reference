import { StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { Meta, StoryObj } from '@storybook/react';

import { AllOrNothingDialog, Props } from './AllOrNothingDialog';
import { mockAllOrNothingDialog } from './mocks';

import { GameTimer } from '@game-logic/timer';
import { withGameState } from '@game-story-helpers';

const PLAYER_ID = 'player-id';
const CARD_ID = 'card-id';
const INITIAL_CARD_POINTS = 50;

const mockMatchGroup = new MockMatchGroup('test-group', PLAYER_ID);
const defaultGameInit = {
  matchStateData: {
    players: [
      {
        userId: PLAYER_ID,
        activeCard: {
          cardId: CARD_ID,
          points: INITIAL_CARD_POINTS,
        },
      },
    ],
  },
};

export default {
  title: 'MatchViewLg/Card Row/AllOrNothingDialog',
  component: AllOrNothingDialog,
  argTypes: {},
  decorators: [withGameState(mockMatchGroup, defaultGameInit)],
  parameters: StoryHelpers.Apollo.addMocks(
    mockAllOrNothingDialog({
      cardId: CARD_ID,
    }),
  ),
} as Meta<typeof AllOrNothingDialog>;

type Story = StoryObj<Props>;

const allOrNothing: Props['aonState'] = {
  cardId: CARD_ID,
  boosterPoints: [],
  allOrNothing: {
    nextPoints: 100,
    totalPoints: 50,
  },
  timer: GameTimer.FromNow(10000),
};

export const Defaults: Story = {
  args: {
    aonState: allOrNothing,
  },
};
