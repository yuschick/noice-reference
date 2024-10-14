import { Meta, StoryObj, StoryFn } from '@storybook/react';

import {
  LocalPlayerCardPlaceholder as CardPlaceholderComponent,
  Props,
} from './LocalPlayerCardPlaceholder';

import { cardSize } from '@game-story-helpers';

export default {
  title: 'Local Player Card Placeholder',
  component: CardPlaceholderComponent,
  parameters: {
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    size: cardSize,
  },
} as Meta<typeof CardPlaceholderComponent>;

type Story = StoryObj<Props>;

const Template: StoryFn<Props> = (args) => (
  <div style={{ inlineSize: 'var(--game-card-width-breakpoint-large)' }}>
    <CardPlaceholderComponent {...args} />
  </div>
);

export const Default: Story = {
  render: Template,

  args: {
    onCardPick: () => {},
  },
};

export const WithoutAction: Story = {
  render: Template,

  args: {
    ...Default.args,
    onCardPick: undefined,
  },
};
