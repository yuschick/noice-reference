import { Meta } from '@storybook/react';

import { GameEventBonus } from './GameEventBonus';

import { cardSize } from '@game-story-helpers';

export default {
  title: 'Game Event Bonus',
  component: GameEventBonus,
  argTypes: {
    size: cardSize,
  },
} as Meta<typeof GameEventBonus>;

export const Default = {
  args: {
    points: 2000,
  },
};
