import { StoryHelpers } from '@noice-com/common-ui';
import { Meta, StoryObj } from '@storybook/react';

import { ActiveBoosterTooltipContent, Props } from './ActiveBoosterTooltipContent';

import { BoosterType } from '@game-types';

export default {
  title: 'ActiveBoosterTooltipContent',
  component: ActiveBoosterTooltipContent,
} as Meta<typeof ActiveBoosterTooltipContent>;

type Story = StoryObj<Props>;

const boosterOwner = StoryHelpers.getNewProfile();
const cardOwner = StoryHelpers.getNewProfile();

const booster: Props['booster'] = {
  id: BoosterType.GoodCall,
  name: 'Hype',
  descriptionCondition: 'Card SUCCEEDS in next 60s',
  descriptionDefaultBenefit: 'Card +50% Points',
  descriptionTargetNoneBenefit: "You score 50% of card's current points",
  descriptionTargetSelf: 'Card +150% Points',
};

export const Default: Story = {
  args: {
    boosterOwner,
    cardOwner,
    booster,
  },
};
