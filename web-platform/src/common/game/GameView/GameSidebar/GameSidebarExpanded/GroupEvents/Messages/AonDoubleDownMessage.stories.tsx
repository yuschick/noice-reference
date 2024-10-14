import { GameStoryHelpers, mockGameCard } from '@noice-com/card-game';
import { StoryHelpers } from '@noice-com/common-ui';
import { Meta, StoryFn } from '@storybook/react';

import {
  AonDoubleDownMessage as AonDoubleDownMessageComponent,
  Props,
} from './AonDoubleDownMessage';
import { FloatingCard } from './Shared';

const MAIN_AVATAR = 'https://renderapi.s3.amazonaws.com/YDy7EB8nh.png';

const failedCard = GameStoryHelpers.getNewGraphQLGameCard();

export default {
  title: 'Game Sidebar/Group Events/AoN Double Down Message',
  component: AonDoubleDownMessageComponent,
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
    attempt: {
      control: { type: 'number' },
    },
    maxTries: {
      control: { type: 'number' },
    },
    renderHoverElement: StoryHelpers.disableArg(),
  },
} as Meta<typeof AonDoubleDownMessageComponent>;

const Template: StoryFn<Props> = ({ ...args }) => {
  return <AonDoubleDownMessageComponent {...args} />;
};

export const NoBoosters = {
  render: Template,

  args: {
    playerId: 'testPlayerId',
    playerName: 'Antti',
    playerAvatar: MAIN_AVATAR,
    cardDescription: failedCard.description,
    attempt: 2,
    maxTries: 5,
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
