import { StoryHelpers } from '@noice-com/common-ui';
import { StoryObj, Meta, StoryFn } from '@storybook/react';

import {
  LocalPlayerBoosterDialogContent,
  Props,
} from './LocalPlayerBoosterDialogContent';
import { mockLocalPlayerBoosterDialogContent } from './mocks';

import { BoosterType } from '@game-types';

const boosterId = BoosterType.GoodCall;

export default {
  title: 'Local Player Booster Button/LocalPlayerBoosterDialogContent',
  component: LocalPlayerBoosterDialogContent,
  argTypes: {},
  parameters: {
    backgrounds: { default: 'dark' },
    ...StoryHelpers.Apollo.addMocks(mockLocalPlayerBoosterDialogContent({ boosterId })),
  },
} as Meta<typeof LocalPlayerBoosterDialogContent>;

// Avaiable Boosters
const Template: StoryFn<Props> = ({ ...args }) => {
  return <LocalPlayerBoosterDialogContent {...args} />;
};

export const Default: StoryObj<Props> = {
  render: Template,

  args: {
    boosterId,
  },
};
