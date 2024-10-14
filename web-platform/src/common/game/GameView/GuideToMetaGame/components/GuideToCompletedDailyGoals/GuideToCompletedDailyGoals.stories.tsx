import { Meta, StoryFn } from '@storybook/react';

import { GuideToCompletedDailyGoals } from './GuideToCompletedDailyGoals';

export default {
  title: 'Guide To Meta Game/Guide To Completed Daily Goals',
  component: GuideToCompletedDailyGoals,
} as Meta<typeof GuideToCompletedDailyGoals>;

const Template: StoryFn = ({ ...args }) => {
  return <GuideToCompletedDailyGoals {...args} />;
};

export const Default = {
  render: Template,
};
