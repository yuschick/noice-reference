import { Icon, StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { StoryObj, Meta, StoryFn } from '@storybook/react';
import { CSSProperties } from 'react';

import { FakeStadium } from '../../../../../components/FakeStadium';

import { HighScoringCard, HighScoringCardProps } from './HighScoringCard';
import { mockHighScoringCard } from './mocks';

import { withGameState } from '@game-story-helpers';
import { BoosterType } from '@game-types';

const CARD_ID = '21';
const PLAYER_ID = 'me';
const GROUP_ID = 'groupId';

const mockMatchGroup = new MockMatchGroup(GROUP_ID, PLAYER_ID);

export default {
  title: 'MatchViewLg/High Scoring Card/High Scoring Card',
  component: HighScoringCard,
  argTypes: {
    cardData: StoryHelpers.disableArg(),
    player: StoryHelpers.disableArg(),
    forceState: {
      options: ['appear-from-bottom', 'disappear-to-bottom'],
      control: { type: 'select' },
    },
  },
  decorators: [withGameState(mockMatchGroup)],
} as Meta<typeof HighScoringCard>;

const overflowStyles: CSSProperties = {
  paddingLeft: '100px',
  paddingRight: '100px',
  paddingTop: '100px',
  overflow: 'hidden',
  position: 'absolute',
  bottom: '0',
  right: '0',
};

const Template: StoryFn<HighScoringCardProps> = ({ ...args }) => {
  return (
    <div style={overflowStyles}>
      <HighScoringCard {...args} />
    </div>
  );
};

export const GhostCard = {
  render: Template,

  parameters: {
    ...StoryHelpers.Apollo.addMocks(
      mockHighScoringCard({
        cardId: CARD_ID,
        playerId: PLAYER_ID,
      }),
    ),
  },

  args: {
    cardId: CARD_ID,
    points: 1234,
    boosterIds: [BoosterType.LetsGo, BoosterType.GoodCall],
    playerId: PLAYER_ID,
    groupId: GROUP_ID,
    isPromoted: false,
    countdownDuration: 5000,
    forceState: 'appear',
  },
};

export const PromotedCard = {
  render: Template,

  parameters: {
    ...StoryHelpers.Apollo.addMocks(
      mockHighScoringCard({
        cardId: CARD_ID,
        playerId: PLAYER_ID,
      }),
    ),
  },

  args: {
    cardId: CARD_ID,
    points: 1234,
    boosterIds: [BoosterType.LetsGo, BoosterType.GoodCall],
    playerId: PLAYER_ID,
    groupId: GROUP_ID,
    isPromoted: true,
    countdownDuration: 5000,
    forceState: 'appear',
  },
};

export const StreamerCardGhostCard = {
  render: Template,

  parameters: {
    ...StoryHelpers.Apollo.addMocks(
      mockHighScoringCard({
        cardId: CARD_ID,
        playerId: PLAYER_ID,
        isStreamerCard: true,
      }),
    ),
  },

  args: {
    cardId: CARD_ID,
    points: 1234,
    boosterIds: [BoosterType.LetsGo, BoosterType.GoodCall],
    playerId: PLAYER_ID,
    groupId: GROUP_ID,
    isPromoted: false,
    countdownDuration: 5000,
    forceState: 'appear',
  },
};

export const StreamerCardPromoted = {
  render: Template,

  parameters: {
    ...StoryHelpers.Apollo.addMocks(
      mockHighScoringCard({
        cardId: CARD_ID,
        playerId: PLAYER_ID,
        isStreamerCard: true,
      }),
    ),
  },

  args: {
    ...StreamerCardGhostCard.args,
    isPromoted: true,
  },
};

export const WithStadium: StoryObj<HighScoringCardProps> = {
  render: ({ ...args }) => {
    return (
      <div>
        <Icon icon={FakeStadium} />
        <div style={overflowStyles}>
          <HighScoringCard {...args} />
        </div>
      </div>
    );
  },

  parameters: {
    ...StoryHelpers.Apollo.addMocks(
      mockHighScoringCard({
        cardId: CARD_ID,
        playerId: PLAYER_ID,
      }),
    ),
  },

  args: {
    cardId: CARD_ID,
    points: 1234,
    boosterIds: [BoosterType.LetsGo, BoosterType.GoodCall],
    playerId: PLAYER_ID,
    groupId: GROUP_ID,
    isPromoted: false,
    countdownDuration: 5000,
    forceState: 'appear',
  },
};
