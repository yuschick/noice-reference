import { ContentModeGroupSpotlightPlayer } from '@noice-com/schemas/rendering/transitions.pb';
import type { Meta, StoryObj } from '@storybook/react';

import containerStyles from '../Spotlight.module.css';

import { BestGroup } from './BestGroup';

import { SpotlightBestGroupProfileFragment } from '@stream-gen';

const meta: Meta<typeof BestGroup> = {
  title: 'Spotlight/BestGroup',
  component: BestGroup,
};

export default meta;
type Story = StoryObj<typeof BestGroup>;

const players: ContentModeGroupSpotlightPlayer[] = [
  { points: 4567, userId: 'testUserId1' },
  { points: 1234, userId: 'testUserId2' },
  { points: 2345, userId: 'testUserId3' },
  { points: 3456, userId: 'testUserId4' },
];

const profiles: SpotlightBestGroupProfileFragment[] = [
  {
    userTag: 'Bob Sagget',
    userId: 'testUserId1',
    avatars: { avatar2D: 'https://placekitten.com/g/200/200' },
  },
  {
    userTag: 'Bobby Bobson',
    userId: 'testUserId2',
    avatars: { avatar2D: 'https://placekitten.com/g/200/200' },
  },
  {
    userTag: 'The Dude',
    userId: 'testUserId3',
    avatars: { avatar2D: 'https://placekitten.com/g/200/200' },
  },
  {
    userTag: 'The Lady',
    userId: 'testUserId4',
    avatars: { avatar2D: 'https://placekitten.com/g/200/200' },
  },
];

export const Primary: Story = {
  render: () => (
    <div className={containerStyles.spotlightWrapper}>
      <BestGroup
        duration={5000}
        groupName="Test Group"
        groupPoints={12304}
        players={players}
        profiles={profiles}
      />
    </div>
  ),
};
