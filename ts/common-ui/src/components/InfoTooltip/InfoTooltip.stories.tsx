import { StoryFn } from '@storybook/react';

import { InfoTooltip, Props } from './InfoTooltip';

export default {
  title: 'InfoTooltip',
  component: InfoTooltip,
  argTypes: {},
};

const Template: StoryFn<Props> = (args) => (
  <InfoTooltip {...args}>{args.children}</InfoTooltip>
);

export const Default = {
  render: Template,

  args: {
    children: 'The content for the tooltip',
  },
};
