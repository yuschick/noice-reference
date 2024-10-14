import { StoryFn } from '@storybook/react';

import { CardRowTeamInfoSm, Props } from './CardRowTeamInfoSm';

import { GameInitBuilder, withGameState } from '@game-story-helpers';

export default {
  title: 'Card Row Team Info Sm',
  component: CardRowTeamInfoSm,
  argTypes: {},
};

const Template: StoryFn<Props> = (args) => (
  <div style={{ inlineSize: `15rem` }}>
    <CardRowTeamInfoSm {...args} />
  </div>
);

export const Default = {
  args: {
    groupId: 'Example Group',
  },
  render: Template,
  decorators: [
    withGameState(
      undefined,
      new GameInitBuilder().withGroupName('Best Group').withGroupScore(500).result(),
    ),
  ],
};

export const SoloGroup = {
  args: {
    groupId: 'Solo Group',
  },
  render: Template,
  decorators: [
    withGameState(
      undefined,
      new GameInitBuilder().withGroupScore(250).withSoloGroup(true).result(),
    ),
  ],
};
