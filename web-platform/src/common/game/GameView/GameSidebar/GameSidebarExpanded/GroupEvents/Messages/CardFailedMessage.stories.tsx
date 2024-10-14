import { BoosterType, GameStoryHelpers, mockGameCard } from '@noice-com/card-game';
import { StoryHelpers } from '@noice-com/common-ui';
import { StoryFn } from '@storybook/react';

import { CardFailedMessage, Props } from './CardFailedMessage';
import { FloatingCard } from './Shared';

const MAIN_AVATAR = 'https://renderapi.s3.amazonaws.com/YDy7EB8nh.png';
const SECONDARY_AVATAR = 'https://renderapi.s3.amazonaws.com/B0pTfzBNP.png';

const failedCard = GameStoryHelpers.getNewGraphQLGameCard();

export default {
  title: 'Game Sidebar/Group Events/Card Failed Message',
  component: CardFailedMessage,
  parameters: StoryHelpers.Apollo.addMocks(mockGameCard()),
  argTypes: {
    id: StoryHelpers.disableArg(),
    playerName: {
      control: { type: 'text' },
    },
    playerAvatar: {
      control: { type: 'text' },
    },
    cardDescription: {
      control: { type: 'text' },
    },
    boosters: StoryHelpers.disableArg(),
    renderHoverElement: StoryHelpers.disableArg(),
  },
};

const Template: StoryFn<Props> = ({ ...args }) => {
  return <CardFailedMessage {...args} />;
};

export const NoBoosters = {
  render: Template,

  args: {
    playerId: 'testPlayerId',
    playerName: 'Antti',
    playerAvatar: MAIN_AVATAR,
    cardDescription: failedCard.description,
    renderHoverElement: (show: boolean, ref: React.RefObject<HTMLElement>) => (
      <FloatingCard
        cardData={failedCard}
        containerRef={ref}
        points={failedCard.pointsMin}
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
    cardDescription: failedCard.description,
    boosters: [
      {
        playerAvatar: MAIN_AVATAR,
        boosterType: BoosterType.Doubt,
        boosterName: 'Doubt',
        points: 43,
      },
      {
        playerAvatar: SECONDARY_AVATAR,
        boosterType: BoosterType.Scavenge,
        boosterName: 'Scavenge',
        points: 35,
      },
    ],
    renderHoverElement: (show: boolean, ref: React.RefObject<HTMLElement>) => (
      <FloatingCard
        cardData={failedCard}
        containerRef={ref}
        points={failedCard.pointsMin}
        show={show}
      />
    ),
  },
};
