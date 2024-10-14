import { StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { Meta, StoryObj, StoryFn } from '@storybook/react';

import { OfflineCard, Props } from './OfflineCard';

import { mockPlayerActiveCard } from '@game-components/PlayerActiveCard';
import { cardSize, withGameState } from '@game-story-helpers';

const PLAYER_ID = 'player-id';
const CARD_ID = 'card-id';
const INITIAL_CARD_POINTS = 50;
const INITIAL_TIMER_DURATION = 60;

const mockMatchGroup = new MockMatchGroup('test-group', PLAYER_ID);
const defaultGameInit = {
  matchStateData: {
    players: [
      {
        userId: PLAYER_ID,
        activeCard: {
          cardId: CARD_ID,
          points: INITIAL_CARD_POINTS,
        },
      },
    ],
  },
};

export default {
  title: 'Card Row Active Card /Offline Card',
  component: OfflineCard,
  argTypes: {
    size: cardSize,
  },
  decorators: [withGameState(mockMatchGroup, defaultGameInit)],
  parameters: {
    backgrounds: { default: 'dark' },
    ...StoryHelpers.Apollo.addMocks(
      mockPlayerActiveCard({
        cardId: CARD_ID,
        cardData: {
          description: `Open {targetValue} chests in {timerDuration} seconds`,
          targetValue: 3,
          timerDuration: INITIAL_TIMER_DURATION,
        },
      }),
    ),
  },
} as Meta<typeof OfflineCard>;

type Story = StoryObj<Props>;

const Template: StoryFn<Props> = (args) => (
  <div style={{ inlineSize: 'var(--game-card-width-breakpoint-large)' }}>
    <OfflineCard {...args} />
  </div>
);

export const Default: Story = {
  args: {
    playerId: PLAYER_ID,
  },
  render: Template,
};

export const NoCard: Story = {
  args: {
    playerId: PLAYER_ID,
  },
  render: Template,
};
