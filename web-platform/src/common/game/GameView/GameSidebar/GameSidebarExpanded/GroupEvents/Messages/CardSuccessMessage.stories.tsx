import { BoosterType, GameStoryHelpers, mockGameCard } from '@noice-com/card-game';
import { StoryHelpers } from '@noice-com/common-ui';
import { Meta, StoryFn } from '@storybook/react';

import {
  CardSuccessMessage as CardSuccessMessageComponent,
  Props,
} from './CardSuccessMessage';
import { FloatingCard } from './Shared';

const MAIN_AVATAR = 'https://renderapi.s3.amazonaws.com/YDy7EB8nh.png';
const SECONDARY_AVATAR = 'https://renderapi.s3.amazonaws.com/B0pTfzBNP.png';

const card = GameStoryHelpers.getNewGraphQLGameCard();
const streamerCard = {
  ...card,
  activeStreamerCard: GameStoryHelpers.getNewGraphQLGameStreamerCard(),
};

export default {
  title: 'Game Sidebar/Group Events/Card Success Message',
  component: CardSuccessMessageComponent,
  parameters: StoryHelpers.Apollo.addMocks(mockGameCard()),
  argTypes: {
    id: StoryHelpers.disableArg(),
    playerName: {
      name: 'Player Name',
      control: { type: 'text' },
    },
    playerAvatar: {
      name: 'Player Avatar',
      control: { type: 'text' },
    },
    cardDescription: {
      name: 'Card Description',
      control: { type: 'text' },
    },
    points: {
      name: 'Points',
      control: {
        type: 'number',
        min: 0,
        step: 1,
      },
    },
    isBestPlay: {
      name: 'Is Best Play',
      control: {
        type: 'boolean',
      },
    },
    boosters: StoryHelpers.disableArg(),
    renderHoverElement: StoryHelpers.disableArg(),
  },
} as Meta<typeof CardSuccessMessageComponent>;

const Template: StoryFn<Props> = ({ ...args }) => {
  return <CardSuccessMessageComponent {...args} />;
};

export const NoBoosters = {
  render: Template,

  args: {
    playerId: 'testPlayerId',
    playerName: 'Antti',
    playerAvatar: MAIN_AVATAR,
    points: 213,
    channelName: 'jenix',
    isBestPlay: false,
    cardDescription: card.description,
    renderHoverElement: (show: boolean, ref: React.RefObject<HTMLElement>) => (
      <FloatingCard
        cardData={card}
        containerRef={ref}
        points={card.pointsMin}
        show={show}
      />
    ),
  },
};

export const WithBoosters = {
  render: Template,

  args: {
    playerId: 'testPlayerId',
    playerName: 'Antti',
    playerAvatar: MAIN_AVATAR,
    points: 320,
    isBestPlay: true,
    channelName: 'jenix',
    cardDescription: card.description,
    boosters: [
      {
        playerAvatar: MAIN_AVATAR,
        boosterType: BoosterType.LetsGo,
        boosterName: 'Lets Gooo',
        points: 43,
      },
      {
        playerAvatar: SECONDARY_AVATAR,
        boosterType: BoosterType.GoodCall,
        boosterName: 'Good Call',
        points: 35,
      },
    ],
    renderHoverElement: (show: boolean, ref: React.RefObject<HTMLElement>) => (
      <FloatingCard
        cardData={card}
        containerRef={ref}
        points={card.pointsMin}
        show={show}
      />
    ),
  },
};

export const WithStreamer = {
  render: Template,

  args: {
    playerId: 'testPlayerId',
    playerName: 'Antti',
    playerAvatar: MAIN_AVATAR,
    points: 320,
    isBestPlay: true,
    cardDescription: streamerCard.description,
    isStreamer: true,
    channelName: 'jenix',
    boosters: [],
    renderHoverElement: (show: boolean, ref: React.RefObject<HTMLElement>) => (
      <FloatingCard
        cardData={streamerCard}
        containerRef={ref}
        points={streamerCard.pointsMin}
        show={show}
      />
    ),
  },
};
