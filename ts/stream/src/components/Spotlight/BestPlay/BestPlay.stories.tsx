import { GameStoryHelpers } from '@noice-com/card-game';
import { StoryHelpers } from '@noice-com/common-ui';
import type { Meta, StoryObj } from '@storybook/react';

import containerStyles from '../Spotlight.module.css';

import { BestPlay } from './BestPlay';
import { mockBestPlay } from './mocks';

import { SpotlightBestPlayProfileFragment } from '@stream-gen';

const meta: Meta<typeof BestPlay> = {
  title: 'Spotlight/BestPlay',
  component: BestPlay,
  parameters: StoryHelpers.Apollo.addMocks(mockBestPlay()),
};

export default meta;
type Story = StoryObj<typeof BestPlay>;

const profile: SpotlightBestPlayProfileFragment = {
  userTag: 'Bob Sagget',
  userId: 'testUserId1',
};

const card = GameStoryHelpers.getNewGraphQLGameCard();

export const Primary: Story = {
  render: () => (
    <div className={containerStyles.spotlightWrapper}>
      <BestPlay
        card={card}
        cardPoints={1231}
        duration={5000}
        groupName="Test Group"
        profile={profile}
      />
    </div>
  ),
};
