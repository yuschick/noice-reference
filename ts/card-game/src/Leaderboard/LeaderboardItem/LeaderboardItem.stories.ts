import { StoryHelpers } from '@noice-com/common-ui';
import { StoryObj, Meta } from '@storybook/react';

import { LeaderboardItem, Props } from './LeaderboardItem';
import { mockLeaderboardItem } from './mocks';

const group = {
  rank: 7,
  score: 98,
  playerData: [
    {
      playerId: 'hdfghdf1',
      score: 3451,
    },
    {
      playerId: '2sgfgfds',
      score: 5431,
    },
    {
      playerId: '3jdfaf',
      score: 543123,
    },
    {
      playerId: '4asdfh',
      score: 5431,
    },
  ],
  groupId: 'myGroup',
  groupName: 'My team',
};

export default {
  title: 'Leaderboard/NewLeaderboard/LeaderboardItem',
  component: LeaderboardItem,
  parameters: {
    layout: 'fullscreen',
    ...StoryHelpers.Apollo.addMocks(
      mockLeaderboardItem({
        playerIds: group.playerData.map(({ playerId }) => playerId),
      }),
    ),
  },
} as Meta<typeof LeaderboardItem>;

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    group,
  },
};

export const MyTeam: Story = {
  args: {
    group: {
      ...group,
      own: true,
    },
  },
};

export const ScoreboardVariant: Story = {
  args: {
    group: group,
    variant: 'scoreboard',
  },
};
