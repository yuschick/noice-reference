import { StoryFn, Meta } from '@storybook/react';
import { ReactNode } from 'react';

import { HorizontalProgressBar } from './HorizontalProgressBar';

import { disableArg } from '@common-story-helpers';

interface WrapperProps {
  children: ReactNode;
}

const FullWidthWrapper = ({ children }: WrapperProps) => (
  <div
    style={{
      width: 400,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {children}
  </div>
);

export default {
  title: 'Horizontal Progress Bar',
  component: HorizontalProgressBar,
  argTypes: {
    min: {
      name: 'Minimum Amount',
      control: { type: 'number' },
    },
    max: {
      name: 'Maximum Amount',
      control: { type: 'number' },
    },
    progress: {
      name: 'Current Progress',
      control: { type: 'number' },
    },
    color: disableArg(),
  },
  decorators: [(story) => <FullWidthWrapper>{story()}</FullWidthWrapper>],
} as Meta<typeof HorizontalProgressBar>;

export const Default = {
  args: {
    min: 0,
    max: 3999,
    progress: 3000,
  },
};

export const Loading: StoryFn = () => <HorizontalProgressBar.Loading />;
