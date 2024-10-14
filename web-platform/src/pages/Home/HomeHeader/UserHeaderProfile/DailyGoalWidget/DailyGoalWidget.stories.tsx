import { StoryHelpers } from '@noice-com/common-ui';
import { StoryFn, Meta } from '@storybook/react';
import { ReactNode } from 'react';

import { DailyGoalWidget } from './DailyGoalWidget';

interface WrapperProps {
  children: ReactNode;
}

const FullWidthWrapper = ({ children }: WrapperProps) => (
  <div
    style={{
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {children}
  </div>
);

export default {
  title: 'Home/Daily Goal Widget',
  component: DailyGoalWidget,
  argTypes: {
    setGoals: {
      name: 'Set Goals',
      control: {
        min: 0,
        max: 6,
        step: 1,
        type: 'number',
      },
    },
    completed: {
      name: 'Completed Goals',
      control: {
        min: 0,
        max: 6,
        step: 1,
        type: 'number',
      },
    },
    total: {
      name: 'Total Goals',
      control: {
        min: 0,
        max: 6,
        step: 1,
        type: 'number',
      },
    },
    unclaimed: {
      name: 'Unclaimed Rewards',
      control: {
        min: 0,
        max: 6,
        step: 1,
        type: 'number',
      },
    },
    resetTime: StoryHelpers.disableArg(),
  },
  decorators: [(story) => <FullWidthWrapper>{story()}</FullWidthWrapper>],
} as Meta<typeof DailyGoalWidget>;

export const Default = {
  args: {
    setGoals: 0,
    completed: 0,
    total: 6,
    unclaimed: 0,
    resetTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
  },
};

export const Inactive = {
  args: {
    setGoals: 0,
    completed: 0,
    total: 6,
    unclaimed: 0,
    resetTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
  },
};

export const Active = {
  args: {
    setGoals: 3,
    completed: 0,
    total: 6,
    unclaimed: 0,
    resetTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
  },
};

export const TakeAction = {
  args: {
    setGoals: 3,
    completed: 2,
    total: 3,
    unclaimed: 2,
    resetTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
  },
};

export const Loading: StoryFn = () => <DailyGoalWidget.Loading />;
