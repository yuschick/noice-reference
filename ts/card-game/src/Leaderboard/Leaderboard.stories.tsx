import { StoryHelpers } from '@noice-com/common-ui';
import { StoryFn, StoryObj, Meta } from '@storybook/react';

import { Leaderboard, Props } from './Leaderboard';
import { mockLeaderboard } from './mocks';

const players = [
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
  {
    playerId: '5asfgfas',
    score: 3451,
  },
  {
    playerId: '6afdsadf',
    score: 5431,
  },
];

const fullGroup = players.slice(0, 4);
const halfGroup = players.slice(0, 2);
const onePlayer = players.slice(0, 1);
const threePlayers = players.slice(0, 3);

const ownGroup = {
  rank: 7,
  score: 98,
  playerData: onePlayer,
  groupId: 'myGroup',
  groupName: 'My team',
  own: true,
};

const topGroups = [
  {
    rank: 1,
    score: 43142,
    playerData: fullGroup,
    groupId: 'g1',
    groupName: 'Group 1',
  },
  {
    rank: 2,
    score: 35135,
    playerData: fullGroup,
    groupId: 'g2',
    groupName: 'Group 2',
  },
  {
    rank: 3,
    score: 26645,
    playerData: threePlayers,
    groupId: 'g3',
    groupName: 'Group 3',
  },
  {
    rank: 4,
    score: 12864,
    playerData: fullGroup,
    groupId: 'g4',
    groupName: 'Group 4',
  },
  {
    rank: 5,
    score: 5122,
    playerData: halfGroup,
    groupId: 'g5',
    groupName: 'Group 5',
  },
  {
    rank: 6,
    score: 4426,
    playerData: fullGroup,
    groupId: 'g6',
    groupName: 'Group 6',
  },
  {
    rank: 7,
    score: 98,
    playerData: onePlayer,
    groupId: 'g7',
    groupName: 'Group 7',
  },
  {
    rank: 8,
    score: 64,
    playerData: halfGroup,
    groupId: 'g8',
    groupName: '',
  },
];

const defaultArgs = {
  topGroups,
  totalGroupCount: 48,
};

const Template: StoryFn<Props> = ({ ...args }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        blockSize: '100%',
        inlineSize: '100%',
        padding: '2rem',
      }}
    >
      <div style={{ inlineSize: '100%', maxInlineSize: '40rem' }}>
        <Leaderboard {...args} />
      </div>
    </div>
  );
};

type Story = StoryObj<Props>;

export default {
  title: 'Leaderboard/NewLeaderboard',
  component: Leaderboard,
  render: Template,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    ...StoryHelpers.Apollo.addMocks([
      ...mockLeaderboard({
        playerIds: fullGroup.map((player) => player.playerId),
      }),
      ...mockLeaderboard({
        playerIds: halfGroup.map((player) => player.playerId),
      }),
      ...mockLeaderboard({
        playerIds: onePlayer.map((player) => player.playerId),
      }),
      ...mockLeaderboard({
        playerIds: threePlayers.map((player) => player.playerId),
      }),
    ]),
  },
} as Meta<typeof Leaderboard>;

export const Default: Story = {
  args: defaultArgs,
};

export const OwnGroupOutsideTop8: Story = {
  args: {
    ...defaultArgs,
    ownGroupWithNeighbours: [
      {
        rank: 11,
        score: 4426,
        playerData: fullGroup,
        groupId: 'g11',
        groupName: 'Group 11',
      },
      { ...ownGroup, rank: 12 },
      {
        rank: 13,
        score: 64,
        playerData: halfGroup,
        groupId: 'g13',
        groupName: 'Group 13',
      },
    ],
  },
};

const topGroupsWithOwnSeventh = [...topGroups];
topGroupsWithOwnSeventh.splice(6, 1, { ...ownGroup, rank: 7 });
export const OwnGroupSeventhPosition: Story = {
  args: {
    ...defaultArgs,
    topGroups: topGroupsWithOwnSeventh,
    ownGroupWithNeighbours: topGroupsWithOwnSeventh.slice(5, 7),
  },
};

const topGroupsWithOwnThird = [...topGroups];
topGroupsWithOwnThird.splice(2, 1, { ...ownGroup, rank: 3 });
export const OwnGroupTop5: Story = {
  args: {
    ...defaultArgs,
    topGroups: topGroupsWithOwnThird,
    ownGroupWithNeighbours: topGroupsWithOwnSeventh.slice(5, 7),
  },
};

export const WithSoloWarning: Story = {
  args: {
    ...defaultArgs,
    showSoloWarning: true,
  },
};

export const ScoreboardVariant: Story = {
  args: {
    ...defaultArgs,
    variant: 'scoreboard',
  },
};
