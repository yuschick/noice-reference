import { BoosterType, GameStoryHelpers, mockGameCard } from '@noice-com/card-game';
import { StoryHelpers } from '@noice-com/common-ui';
import { Meta, StoryFn } from '@storybook/react';

import {
  BoosterScoredMessage as BoosterScoredMessageComponent,
  MissingCardPopup,
  Props,
} from './BoosterScoredMessage';
import { FloatingCard } from './Shared';

const MAIN_AVATAR = 'https://renderapi.s3.amazonaws.com/YDy7EB8nh.png';

const failedCard = GameStoryHelpers.getNewGraphQLGameCard();

export default {
  title: 'Game Sidebar/Group Events/Booster Scored Message',
  component: BoosterScoredMessageComponent,
  parameters: StoryHelpers.Apollo.addMocks(mockGameCard()),
  argTypes: {
    id: StoryHelpers.disableArg(),
    playerName: {
      control: { type: 'text' },
    },
    playerAvatar: {
      control: { type: 'text' },
    },
    boosterName: {
      control: { type: 'text' },
    },
    points: {
      control: {
        type: 'number',
        min: 0,
        step: 1,
      },
    },
    BoosterIcon: StoryHelpers.disableArg(),
    renderHoverElement: StoryHelpers.disableArg(),
  },
} as Meta<typeof BoosterScoredMessageComponent>;

const Template: StoryFn<Props> = ({ ...args }) => {
  return <BoosterScoredMessageComponent {...args} />;
};

export const LetsGooo = {
  render: Template,

  args: {
    playerId: 'testPlayerId',
    playerName: 'Antti',
    playerAvatar: MAIN_AVATAR,
    boosterId: BoosterType.LetsGo,
    boosterName: 'Lets Gooo',
    points: 20,
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

export const Doubt = {
  render: Template,

  args: {
    playerId: 'testPlayerId',
    playerName: 'Antti',
    playerAvatar: MAIN_AVATAR,
    boosterId: BoosterType.Doubt,
    boosterName: 'Doubt',
    points: 43,
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

export const DoubtMissingCard = {
  render: Template,

  args: {
    playerId: 'testPlayerId',
    playerName: 'Antti',
    playerAvatar: MAIN_AVATAR,
    boosterId: BoosterType.Doubt,
    boosterName: 'Doubt',
    points: 43,
    renderHoverElement: () => <MissingCardPopup />,
  },
};

export const GoodCall = {
  render: Template,

  args: {
    playerId: 'testPlayerId',
    playerName: 'Antti',
    playerAvatar: MAIN_AVATAR,
    boosterId: BoosterType.GoodCall,
    boosterName: 'Good Call',
    points: 50,
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

export const Scavenge = {
  render: Template,

  args: {
    playerId: 'testPlayerId',
    playerName: 'Antti',
    playerAvatar: MAIN_AVATAR,
    boosterId: BoosterType.Scavenge,
    boosterName: 'Scavenge',
    points: 50,
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
