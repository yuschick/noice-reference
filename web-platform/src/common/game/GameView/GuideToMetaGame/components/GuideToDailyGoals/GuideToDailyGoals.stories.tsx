import { Meta, StoryFn } from '@storybook/react';

import { GuideToDailyGoals } from './GuideToDailyGoals';

export default {
  title: 'Guide To Meta Game/Guide To Daily Goals',
  component: GuideToDailyGoals,
} as Meta<typeof GuideToDailyGoals>;

const Template: StoryFn = ({ ...args }) => {
  return <GuideToDailyGoals {...args} />;
};

export const Default = {
  render: Template,
};
