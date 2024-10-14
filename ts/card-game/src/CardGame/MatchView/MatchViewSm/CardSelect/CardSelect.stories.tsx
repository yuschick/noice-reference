import { StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useEffect } from 'react';

import { CardSelect } from './CardSelect';
import { mockCardSelect } from './mocks';

import { withGameState } from '@game-story-helpers';

const LOCAL_PLAYER_ID = 'me';
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

export default {
  title: 'MatchViewSm/CardSelect',
  component: CardSelect,
  decorators: [withGameState(mockMatchGroup, defaultGameInit)],
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
  parameters: StoryHelpers.Apollo.addMocks([
    ...mockCardSelect({
      cardIds: handCardIds,
    }),
  ]),
};

export const WithMatchEndCards: Story = {
  args: {},
  render: (args) => (
    <Template
      {...args}
      showMatchEndCards
    />
  ),
  parameters: StoryHelpers.Apollo.addMocks([
    ...mockCardSelect({
      cardIds: [...handCardIds, ...matchCardIds],
    }),
  ]),
};
