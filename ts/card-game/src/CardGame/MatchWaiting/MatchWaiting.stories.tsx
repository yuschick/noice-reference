import { Icon, StoryHelpers } from '@noice-com/common-ui';
import { StoryFn } from '@storybook/react';

import { FakeStadium } from '../../components/FakeStadium';

import { MatchWaiting as MatchWaitingComponent } from './MatchWaiting';

export default {
  title: 'Match Waiting',
  component: MatchWaitingComponent,
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [StoryHelpers.decorateForceRerender],
};

const Template: StoryFn = ({ ...args }) => {
  return (
    <div>
      <Icon icon={FakeStadium} />
      <MatchWaitingComponent {...args} />;
    </div>
  );
};

export const MatchWaiting = {
  render: Template,
  args: {},
};
