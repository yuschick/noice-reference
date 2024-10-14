import { StoryObj } from '@storybook/react';

import { Breakpoint, Props } from './Breakpoint';

export default {
  title: 'Breakpoint',
  component: Breakpoint,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: `Breakpoint component is to be used when wanting to render something ONLY when a certain media query is met. Check also 'useMediaQuery' hook that is also available for same type of usage.`,
      },
    },
  },
};

type Story = StoryObj<Props>;

export const Example: Story = {
  render: () => (
    <div>
      Try out changing browser width. Current view is{' '}
      <Breakpoint query={'(max-width: 799px)'}>less than 800px wide</Breakpoint>
      <Breakpoint query={'(min-width: 800px) and (max-width: 1200px)'}>
        between 800px and 1200px wide
      </Breakpoint>
      <Breakpoint query={'(min-width: 1201px)'}>wider than 1200px</Breakpoint>
    </div>
  ),
};
