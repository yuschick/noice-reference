import { BoosterType, GameStoryHelpers, mockGameCard } from '@noice-com/card-game';
import { StoryHelpers } from '@noice-com/common-ui';
import { Meta, StoryFn } from '@storybook/react';

import {
  CardScavengeMessage as CardScavengeMessageComponent,
  Props,
} from './CardScavengeMessage';
import { FloatingCard } from './Shared';

const MAIN_AVATAR = 'https://renderapi.s3.amazonaws.com/YDy7EB8nh.png';
const SECONDARY_AVATAR = 'https://renderapi.s3.amazonaws.com/B0pTfzBNP.png';

const failedCard = GameStoryHelpers.getNewGraphQLGameCard();

export default {
  title: 'Game Sidebar/Group Events/Card Scavenge Message',
  component: CardScavengeMessageComponent,
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
    points: {
      control: {
        type: 'number',
        min: 0,
        step: 1,
      },
    },
    wasSwitchedOut: {
      control: { type: 'boolean' },
    },
    boosters: StoryHelpers.disableArg(),
    renderHoverElement: StoryHelpers.disableArg(),
  },
} as Meta<typeof CardScavengeMessageComponent>;

const Template: StoryFn<Props> = ({ ...args }) => {
  return <CardScavengeMessageComponent {...args} />;
};

export const CardFailed = {
  render: Template,

  args: {
    playerId: 'testPlayerId',
    playerName: 'Antti',
    playerAvatar: MAIN_AVATAR,
    cardDescription: failedCard.description,
    points: 50,
    wasSwitchedOut: false,
    boosters: [
      {
        playerAvatar: MAIN_AVATAR,
        boosterType: BoosterType.Scavenge,
        boosterName: 'Scavenge',
        points: 50,
      },
      {
        playerAvatar: SECONDARY_AVATAR,
        boosterType: BoosterType.Doubt,
        boosterName: 'Doubt',
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

export const SwitchedOut = {
  render: Template,

  args: {
    playerId: 'testPlayerId',
    playerName: 'Antti',
    playerAvatar: MAIN_AVATAR,
    cardDescription: failedCard.description,
    points: 50,
    wasSwitchedOut: true,
    boosters: [
      {
        playerAvatar: MAIN_AVATAR,
        boosterType: BoosterType.Scavenge,
        boosterName: 'Scavenge',
        points: 50,
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
