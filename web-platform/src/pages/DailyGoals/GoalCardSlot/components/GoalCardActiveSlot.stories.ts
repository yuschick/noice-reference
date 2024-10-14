import { WalletCurrencyId } from '@noice-com/common-ui';
import { GoalCardSlotState } from '@noice-com/platform-client';
import { Meta } from '@storybook/react';

import { Props as DailyGoalCardDefaultProps } from '../../GoalCard/GoalCard';
import {
  Default as DailyGoalCardDefault,
  GroupOnly as DailyGoalCardGroupOnly,
} from '../../GoalCard/GoalCard.stories';

import { GoalCardActiveSlot } from './GoalCardActiveSlot';

export default {
  title: 'Goal Card/Active Slot',
  component: GoalCardActiveSlot,
  parameters: {
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    progress: {
      name: 'Progress',
      description: 'Current progress of the Daily Goal Card',
      control: { type: 'number' },
    },
    goal: {
      name: 'Goal',
      description: 'The goal of the Daily Goal Card (max progress)',
      control: { type: 'number' },
    },
    showCollectedAnimation: {
      name: 'Collected animation',
      description: 'Show collected animation',
      control: { type: 'boolean' },
    },
    switchOutCurrency: {
      name: 'Switchout currency',
      options: Object.values(WalletCurrencyId),
      control: { type: 'select' },
    },
    soloPlayActive: {
      name: 'Solo Play Active',
      description: 'If the player is currently playing solo in a game',
      control: { type: 'boolean' },
    },
    switchOutCost: {
      name: 'Switchout cost',
      control: { type: 'number' },
    },
    onCollectClicked: { control: 'collectClicked ' },
    onSwitchOutClicked: { control: 'switchOutClicked ' },
  },
} as Meta<typeof GoalCardActiveSlot>;

export const InProgress = {
  args: {
    card: { ...(DailyGoalCardDefault.args as Required<DailyGoalCardDefaultProps>) },
    progress: 3,
    goal: 12,
    slotId: 'slot1',
    switchOutCost: 1,
    switchOutCurrency: WalletCurrencyId.ReshuffleToken,
    state: GoalCardSlotState.SELECTED,
  },
};

export const InProgressRequiresTeam = {
  args: {
    card: { ...(DailyGoalCardGroupOnly.args as Required<DailyGoalCardDefaultProps>) },
    progress: 3,
    goal: 12,
    slotId: 'slot1',
    switchOutCost: 1,
    soloPlayActive: true,
    switchOutCurrency: WalletCurrencyId.ReshuffleToken,
    state: GoalCardSlotState.SELECTED,
  },
};

export const UnCollected = {
  args: {
    card: { ...(DailyGoalCardDefault.args as Required<DailyGoalCardDefaultProps>) },
    progress: 12,
    goal: 12,
    slotId: 'slot1',
    state: GoalCardSlotState.COMPLETED,
  },
};

export const Collected = {
  args: {
    card: { ...(DailyGoalCardDefault.args as Required<DailyGoalCardDefaultProps>) },
    progress: 12,
    goal: 12,
    slotId: 'slot1',
    state: GoalCardSlotState.COLLECTED,
  },
};
