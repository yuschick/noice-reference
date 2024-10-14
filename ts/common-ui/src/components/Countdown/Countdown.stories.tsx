/* eslint-disable @typescript-eslint/naming-convention */

import { Meta, StoryFn } from '@storybook/react';

import { Countdown, CountdownProps } from './Countdown';

import { disableArg } from '@common-story-helpers';

export default {
  title: 'Countdown',
  component: Countdown,
  argTypes: {
    className: disableArg(),
    onCompleted: disableArg(),
  },
} as Meta<typeof Countdown>;

const Template: StoryFn<CountdownProps> = ({ ...args }) => <Countdown {...args} />;

Template.parameters = {};

export const Default = {
  render: Template,

  args: {
    target: new Date(Date.now() + 150000),
  },
};
