/* eslint-disable @typescript-eslint/naming-convention */

import { Meta, StoryFn } from '@storybook/react';

import { GameCardWithVFX, GameCardWithVFXProps } from './GameCardWithVFX';
import { VFXCardAnimationState } from './types';

import { GameCard } from '@game-card';
import { getNewGraphQLGameCard } from '@game-story-helpers';

export default {
  title: 'MatchViewLg/High Scoring Card/GameCard with VFX',
  component: GameCardWithVFX,
  argTypes: {
    animation: {
      control: {
        type: 'select',
        options: [
          VFXCardAnimationState.None,
          VFXCardAnimationState.Success,
          VFXCardAnimationState.PersonalBest,
        ],
        labels: {
          [VFXCardAnimationState.None]: 'None',
          [VFXCardAnimationState.Success]: 'Success',
          [VFXCardAnimationState.PersonalBest]: 'PersonalBest',
        },
      },
    },
  },
} as Meta<typeof GameCardWithVFX>;

const card = getNewGraphQLGameCard();

const Template: StoryFn<GameCardWithVFXProps> = ({ ...args }) => (
  <GameCardWithVFX {...args}>
    <div style={{ inlineSize: 'var(--game-card-width-breakpoint-medium)' }}>
      <GameCard card={card} />
    </div>
  </GameCardWithVFX>
);

Template.parameters = {};

export const Default = {
  render: Template,

  args: {
    duration: 2000,
  },
};
