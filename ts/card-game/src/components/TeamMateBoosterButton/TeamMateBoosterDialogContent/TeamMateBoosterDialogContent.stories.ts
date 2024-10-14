import { StoryHelpers } from '@noice-com/common-ui';
import { Meta } from '@storybook/react';

import { mockTeamMateBoosterDialogContent } from './mocks';
import { TeamMateBoosterDialogContent, Props } from './TeamMateBoosterDialogContent';

import { BoosterType } from '@game-types';

const PLAYER_ID = '1';
const boosterId = BoosterType.GoodCall;

export default {
  title: 'Team Mate Booster Button/TeamMateBoosterDialogContent',
  component: TeamMateBoosterDialogContent,
  argTypes: {},
  parameters: StoryHelpers.Apollo.addMocks(
    mockTeamMateBoosterDialogContent({ playerId: PLAYER_ID, boosterId }),
  ),
} as Meta<typeof TeamMateBoosterDialogContent>;

const data: Props = {
  boosterId,
};

export const Default = {
  args: {
    ...data,
  },
};
