import { StoryObj, StoryFn } from '@storybook/react';

import { AnimatedBoosterScore, Props } from './AnimatedBoosterScore';

import { BoosterType } from '@game-types';

export default {
  title: 'Animated Booster Scores/Animated Booster Score',
  component: AnimatedBoosterScore,
};

type Story = StoryObj<Props>;

const Template: StoryFn<Props> = (args) => (
  <div style={{ position: 'relative' }}>
    <div style={{ position: 'absolute' }}>
      <AnimatedBoosterScore {...args} />
    </div>
  </div>
);

export const Default: Story = {
  args: {
    duration: 1000,
    booster: {
      boosterId: BoosterType.NextUp,
      points: 200,
    },
  },
  render: Template,
};
