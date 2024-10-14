import { StoryHelpers } from '@noice-com/common-ui';

import { CardRowAvatar } from './CardRowAvatar';
import { mockCardRowAvatar } from './mocks';

import { FriendsFriendshipStatusStatus } from '@game-gen';

const player = StoryHelpers.getNewProfile();

export default {
  title: 'CardRowAvatar',
  component: CardRowAvatar,
  decorators: [StoryHelpers.withAuthProvider({ userId: player.userId })],
};

export const Default = {
  args: {
    player,
  },
  parameters: StoryHelpers.Apollo.addMocks(
    mockCardRowAvatar({
      playerId: player.userId,
    }),
  ),
};

export const Friend = {
  args: {
    player: {
      ...player,
      friendshipStatus: {
        status: FriendsFriendshipStatusStatus.StatusFriend,
      },
    },
  },
  parameters: StoryHelpers.Apollo.addMocks(
    mockCardRowAvatar({
      playerId: player.userId,
    }),
  ),
};

export const Loading = {
  args: {
    player,
  },
  render: () => <CardRowAvatar.Loading />,
};
