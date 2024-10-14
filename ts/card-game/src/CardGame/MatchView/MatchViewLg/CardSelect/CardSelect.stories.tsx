import { StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useEffect } from 'react';

import { CardSelect } from './CardSelect';
import { mockCardSelect } from './mocks';

import { withCardGameUIProvider, withGameState } from '@game-story-helpers';

const LOCAL_PLAYER_ID = 'me';
const ACTIVE_CARD_ID = 'active-card-id';
const handCardIds = ['1', '2', '3', '4', '5'];
const matchCardIds = ['6', '7'];

const mockMatchGroup = new MockMatchGroup('test-group', LOCAL_PLAYER_ID);
const defaultGameInit = {
  matchStateData: {
    players: [
      {
        userId: LOCAL_PLAYER_ID,
      },
    ],
  },
};
const gameInitWithActiveCard = {
  matchStateData: {
    players: [
      {
        userId: LOCAL_PLAYER_ID,
        activeCard: {
          cardId: ACTIVE_CARD_ID,
          points: 250,
        },
      },
    ],
  },
};

export default {
  title: 'MatchViewLg/CardSelect',
  component: CardSelect,
  parameters: StoryHelpers.Apollo.addMocks([
    ...mockCardSelect({ handCardIds, matchCardIds, activeCardId: ACTIVE_CARD_ID }),
  ]),
  decorators: [
    withGameState(mockMatchGroup, defaultGameInit),
    withCardGameUIProvider({
      isCardSelectOpenDefault: true,
    }),
  ],
} as Meta<typeof CardSelect>;

type TemplateProps = React.ComponentProps<typeof CardSelect> & {
  showMatchEndCards?: boolean;
};
type Story = StoryObj<TemplateProps>;

const Template: StoryFn<TemplateProps> = ({ showMatchEndCards, ...args }) => {
  useEffect(() => {
    const timeout = setTimeout(
      () =>
        mockMatchGroup.triggerEvent('onHandShuffled', {
          cardIds: handCardIds,
          matchEndCardIds: showMatchEndCards ? matchCardIds : [],
          userId: LOCAL_PLAYER_ID,
        }),
      100,
    );

    return () => clearTimeout(timeout);
  }, [showMatchEndCards]);

  return <CardSelect {...args} />;
};

export const Default: Story = {
  args: {},
  render: Template,
};

export const WithMatchEndCards: Story = {
  args: {},
  render: (args) => (
    <Template
      {...args}
      showMatchEndCards
    />
  ),
};

export const WithActiveCard = {
  args: {},
  render: Template,
  decorators: [withGameState(mockMatchGroup, gameInitWithActiveCard)],
};
