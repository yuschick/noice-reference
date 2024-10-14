import { CardRowTeamInfoLg } from './CardRowTeamInfoLg';

import { GameInitBuilder, withGameState } from '@game-story-helpers';

export default {
  title: 'Card Row Team Info Lg',
  component: CardRowTeamInfoLg,
  argTypes: {},
};

export const Default = {
  args: {
    groupId: 'Example Group',
  },

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

  decorators: [
    withGameState(
      undefined,
      new GameInitBuilder().withGroupScore(250).withSoloGroup(true).result(),
    ),
  ],
};
