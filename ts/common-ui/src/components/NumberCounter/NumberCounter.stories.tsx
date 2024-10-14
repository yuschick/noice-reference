import { StoryFn } from '@storybook/react';

import { NumberCounter, Props } from './NumberCounter';

export default {
  title: 'Number Counter',
  component: NumberCounter,
};

const Template: StoryFn<Props> = ({ ...args }) => <NumberCounter {...args} />;

export const Default = {
  render: Template,

  args: {
    targetValue: 1000,
    duration: 20000,
  },
};
