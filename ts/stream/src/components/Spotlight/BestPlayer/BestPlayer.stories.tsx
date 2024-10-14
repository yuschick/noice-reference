import type { Meta, StoryObj } from '@storybook/react';

import containerStyles from '../Spotlight.module.css';

import { BestPlayer } from './BestPlayer';

import { SpotlightBestPlayerProfileFragment } from '@stream-gen';

const meta: Meta<typeof BestPlayer> = {
  title: 'Spotlight/BestPlayer',
  component: BestPlayer,
};

export default meta;
type Story = StoryObj<typeof BestPlayer>;

const profile: SpotlightBestPlayerProfileFragment = {
  userTag: 'Bob Sagget',
  userId: 'testUserId1',
  avatars: { avatar2D: 'https://placekitten.com/g/200/200' },
};

export const Primary: Story = {
  render: () => (
    <div className={containerStyles.spotlightWrapper}>
      <BestPlayer
        duration={5000}
        groupName="Test Group"
        points={4567}
        profile={profile}
      />
    </div>
  ),
};
