import { Meta, StoryFn } from '@storybook/react';

import { GoalCardEmptySlot, Props } from './GoalCardEmptySlot';

export default {
  title: 'Goal Card/Empty Slot',
  component: GoalCardEmptySlot,
  parameters: {
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    text: {
      name: 'Text',
      description: 'Text show within the empty slot',
      control: { type: 'text' },
    },
    onSlotClicked: { action: 'clicked' },
  },
} as Meta<typeof GoalCardEmptySlot>;

const Template: StoryFn<Props> = ({ ...args }) => {
  return <GoalCardEmptySlot {...args} />;
};

Template.parameters = {};

export const Default = {
  render: Template,
  parameters: {},

  args: {
    text: 'Add card',
    slotId: 'slot1',
  },
};
