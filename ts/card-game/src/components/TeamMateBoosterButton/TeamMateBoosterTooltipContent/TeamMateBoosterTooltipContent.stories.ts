import { StoryHelpers } from '@noice-com/common-ui';
import { Meta } from '@storybook/react';

import { mockTeamMateBoosterTooltipContent } from './mocks';
import { TeamMateBoosterTooltipContent, Props } from './TeamMateBoosterTooltipContent';

import { BoosterType } from '@game-types';

const PLAYER_ID = '1';
const boosterId = BoosterType.GoodCall;

export default {
  title: 'Team Mate Booster Button/TeamMateBoosterTooltipContent',
  component: TeamMateBoosterTooltipContent,
  argTypes: {},
  parameters: StoryHelpers.Apollo.addMocks(
    mockTeamMateBoosterTooltipContent({ playerId: PLAYER_ID, boosterId }),
  ),
} as Meta<typeof TeamMateBoosterTooltipContent>;

const data: Props = {
  playerId: PLAYER_ID,
  boosterId,
};

export const Default = {
  args: {
    ...data,
  },
};

export const HasRequested = {
  args: {
    ...data,
    hasRequested: true,
  },
};
