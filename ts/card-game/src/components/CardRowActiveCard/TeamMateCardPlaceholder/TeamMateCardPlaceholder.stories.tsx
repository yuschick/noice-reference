import { Meta, StoryObj, StoryFn } from '@storybook/react';

import { TeamMateCardPlaceholder } from './TeamMateCardPlaceholder';

import { cardSize } from '@game-story-helpers';

export default {
  title: 'Card Row Active Card/Team Mate Card Placeholder',
  component: TeamMateCardPlaceholder,
  parameters: {
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    size: cardSize,
  },
} as Meta<typeof TeamMateCardPlaceholder>;

type Story = StoryObj;

const Template: StoryFn = (args) => (
  <div style={{ inlineSize: 'var(--game-card-width-breakpoint-large)' }}>
    <TeamMateCardPlaceholder {...args} />
  </div>
);

export const Default: Story = {
  render: Template,
};
