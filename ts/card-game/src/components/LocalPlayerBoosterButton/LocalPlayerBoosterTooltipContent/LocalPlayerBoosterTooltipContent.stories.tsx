import { StoryHelpers } from '@noice-com/common-ui';
import { StoryObj, Meta, StoryFn } from '@storybook/react';

import {
  LocalPlayerBoosterTooltipContent,
  Props,
} from './LocalPlayerBoosterTooltipContent';
import { mockLocalPlayerBoosterTooltipContent } from './mocks';

import { BoosterType } from '@game-types';

const boosterId = BoosterType.GoodCall;

export default {
  title: 'Local Player Booster Button/LocalPlayerBoosterTooltipContent',
  component: LocalPlayerBoosterTooltipContent,
  parameters: {
    backgrounds: { default: 'dark' },
    ...StoryHelpers.Apollo.addMocks(mockLocalPlayerBoosterTooltipContent({ boosterId })),
  },
  argTypes: {
    condition: {
      name: 'Condition',
      control: { type: 'text' },
    },
    targetSelf: {
      name: 'targetSelf',
      control: { type: 'text' },
    },
    defaultBenefit: {
      name: 'defaultBenefit',
      control: { type: 'text' },
    },
    otherBenefit: {
      name: 'otherBenefit',
      control: { type: 'text' },
    },
    targetNoneBenefit: {
      name: 'targetNoneBenefit',
      control: { type: 'text' },
    },
    pos: StoryHelpers.disableArg(),
  },
} as Meta<typeof LocalPlayerBoosterTooltipContent>;

// Avaiable Boosters
const Template: StoryFn<Props> = ({ ...args }) => {
  return <LocalPlayerBoosterTooltipContent {...args} />;
};

export const Default: StoryObj<Props> = {
  render: Template,

  args: {
    boosterId,
  },
};
