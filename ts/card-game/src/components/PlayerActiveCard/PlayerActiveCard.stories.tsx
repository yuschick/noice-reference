import { StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { Meta, StoryObj, StoryFn } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';

import { mockPlayerActiveCard } from './mocks';
import { PlayerActiveCard, Props } from './PlayerActiveCard';

import { CardHighlightStateType } from '@game-common/card';
import { withGameState } from '@game-story-helpers';

const PLAYER_ID = 'player-id';
const CARD_ID = 'card-id';
const INITIAL_CARD_POINTS = 50;
const INITIAL_TIMER_DURATION = 60;
const MAX_POINTS = 1450;

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
  title: 'PlayerActiveCard',
  component: PlayerActiveCard,
  argTypes: {
    cardHighlightState: {
      name: 'Card State',
      control: 'select',
      options: Object.values(CardHighlightStateType),
    },
    cardSize: {
      name: 'Card size',
      control: 'select',
      defaultValue: 'large',
      options: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
    },
  },
  decorators: [withGameState(mockMatchGroup, defaultGameInit)],
  parameters: StoryHelpers.Apollo.addMocks(
    mockPlayerActiveCard({
      cardId: CARD_ID,
      cardData: {
        description: `Open {targetValue} chests in {timerDuration} seconds`,
        targetValue: 3,
        timerDuration: INITIAL_TIMER_DURATION,
        pointsMax: MAX_POINTS,
      },
    }),
  ),
} as Meta<typeof PlayerActiveCard>;

interface ArgProps extends Props {
  cardSize: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
}

type Story = StoryObj<ArgProps>;

const Template: StoryFn<ArgProps> = ({ cardSize, ...restArgs }) => (
  <div style={{ inlineSize: `var(--game-card-width-breakpoint-${cardSize ?? 'large'})` }}>
    <PlayerActiveCard {...restArgs} />
  </div>
);

export const Default: Story = {
  args: {
    cardId: CARD_ID,
    playerId: PLAYER_ID,
  },
  render: Template,
};

const PointsUpdatingTemplate: StoryFn<ArgProps> = (args) => {
  const points = useRef<number>(INITIAL_CARD_POINTS);
  const [boosterEnabled, setBoosterEnabled] = useState<boolean>(false);

  useEffect(() => {
    const updateInterval = boosterEnabled ? 1000 : 3000;
    const interval = setInterval(() => {
      points.current =
        points.current + 50 >= MAX_POINTS ? MAX_POINTS : points.current + 50;

      mockMatchGroup.triggerEvent('onActiveCardPointsUpdated', {
        points: points.current,
        userId: PLAYER_ID,
        cardId: CARD_ID,
        pointsUpdateDuration:
          points.current !== MAX_POINTS ? `${updateInterval}` : undefined,
      });

      if (points.current === MAX_POINTS) {
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [boosterEnabled]);

  const onClick = () => {
    setBoosterEnabled(true);
    setTimeout(() => setBoosterEnabled(false), 5000);
  };

  return (
    <Template
      {...args}
      onClick={onClick}
    />
  );
};

export const PointsUpdating = {
  args: {
    cardId: CARD_ID,
    playerId: PLAYER_ID,
  },
  render: PointsUpdatingTemplate,
};

const DescriptionUpdatingTemplate: StoryFn<ArgProps> = (args) => {
  useEffect(() => {
    let timerDuration = INITIAL_TIMER_DURATION;
    const interval = setInterval(() => {
      timerDuration -= 1;

      if (timerDuration <= 0) {
        clearInterval(interval);
        return;
      }

      mockMatchGroup.triggerEvent('onActiveCardTargetValueChanged', {
        timerDuration,
        userId: PLAYER_ID,
        cardId: CARD_ID,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <Template {...args} />;
};

export const DescriptionUpdating = {
  args: {
    cardId: CARD_ID,
    playerId: PLAYER_ID,
  },
  render: DescriptionUpdatingTemplate,
};
