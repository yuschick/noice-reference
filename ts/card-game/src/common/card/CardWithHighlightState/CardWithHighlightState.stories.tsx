import { StoryHelpers } from '@noice-com/common-ui';
import { StoryFn } from '@storybook/react';

import { CardHighlightState, CardHighlightStateType } from '../types';

import { CardWithHighlightState } from './CardWithHighlightState';
import { mockCardWithHighlightState } from './mocks';

import { BoosterType } from '@game-types';

const CARD_ID = 'cardId';

export default {
  title: 'CardWithHighlightState',
  component: CardWithHighlightState,
  parameters: StoryHelpers.Apollo.addMocks(
    mockCardWithHighlightState({ cardId: CARD_ID }),
  ),
};

type Props = Parameters<typeof CardWithHighlightState>[0];

interface ArgProps extends Props {
  highlightStateType: CardHighlightStateType;
}

const Template: StoryFn<ArgProps> = (args) => (
  <div style={{ inlineSize: `var(--game-card-width-breakpoint-large)` }}>
    <CardWithHighlightState {...args} />
  </div>
);

const boosters = [
  { boosterId: BoosterType.GoodCall, points: 150 },
  { boosterId: BoosterType.Doubt },
  { boosterId: BoosterType.LetsGo, points: 200 },
];

const boosterAnimationTimings: CardHighlightState['boosterAnimationTimings'] = {
  totalDuration: 5000,
  playerScoreDuration: 800,
  highlightBoosterDuration: 1000,
  highlightBoosterDelay: 200,
  boosterLabelStartDelay: 500,
  boosterScoreStartDelay: 900,
  boosterScoreInternalDelay: 400,
  boosterScoreInternalDuration: 600,
};

const state: Omit<CardHighlightState, 'type'> = {
  cardId: CARD_ID,
  points: 500,
  boosters,
  boosterAnimationTimings,
  playerTotalPoints: 2000,
};

export const Success = {
  args: {
    state: {
      ...state,
      type: CardHighlightStateType.Success,
    },
  },
  render: Template,
};

export const BestPlay = {
  args: {
    state: {
      ...state,
      type: CardHighlightStateType.BestPlay,
    },
  },
  render: Template,
};

export const Failure = {
  args: {
    state: {
      ...state,
      type: CardHighlightStateType.Failure,
    },
  },
  render: Template,
};
