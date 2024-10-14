import { StoryHelpers } from '@noice-com/common-ui';
import { StoryFn } from '@storybook/react';

import { AllOrNothingState } from '../types';

import { AllOrNothingPending, Props } from './AllOrNothingPending';
import { mockAllOrNothingPending } from './mocks';

import { GameTimer } from '@game-logic/timer';
import { BoosterType } from '@game-types';

const CARD_ID = 'cardId';

export default {
  title: 'AllOrNothingPending',
  component: AllOrNothingPending,
  parameters: StoryHelpers.Apollo.addMocks(mockAllOrNothingPending({ cardId: CARD_ID })),
};

const Template: StoryFn<Props> = (args) => (
  <div style={{ inlineSize: `var(--game-card-width-breakpoint-large)` }}>
    <AllOrNothingPending {...args} />
  </div>
);

const aonState: AllOrNothingState = {
  cardId: CARD_ID,
  allOrNothing: {
    nextPoints: 1100,
    totalPoints: 550,
  },
  timer: GameTimer.FromNow(15),
  boosterPoints: [
    {
      boosterId: BoosterType.GoodCall,
      points: 200,
    },
    {
      boosterId: BoosterType.LetsGo,
      points: 100,
    },
  ],
};

export const Default = {
  args: {
    aonState,
  },
  render: Template,
};
