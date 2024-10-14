import { StoryHelpers } from '@noice-com/common-ui';
import { ArgTypes } from '@storybook/types';

import {
  MiniProfileStoryArgs,
  addMiniProfileProviderDecorator,
  addSocialPackageProviderDecorator,
} from '../mocks/story-mocks';

import { MiniProfile } from './MiniProfile';

import {
  FriendsFriendshipStatusStatus,
  MiniProfileFollowingStateDocument,
  MiniProfileGameRankChannelDocument,
} from '@social-gen';

const helperProfile = StoryHelpers.getNewProfile();

const CHANNEL_ID = 'channel-id';
const GAME_ID = 'game-id';
const SEASON_ID = 'game-season-id';

const argTypes: ArgTypes<MiniProfileStoryArgs> = {
  profile: StoryHelpers.disableArg(),
  showModerationButtons: {
    control: {
      type: 'boolean',
    },
  },
  showBadges: {
    control: {
      type: 'boolean',
    },
  },
  showAsMuted: {
    control: {
      type: 'boolean',
    },
  },
  showAsBanned: {
    control: {
      type: 'boolean',
    },
  },
  showRank: {
    control: {
      type: 'boolean',
    },
  },
  friendStatus: {
    options: ['friend', 'asked', 'received', 'none'],
    control: {
      type: 'radio',
    },
  },
  isSubscriber: {
    control: {
      type: 'boolean',
    },
  },
  hasNewUsername: {
    control: {
      type: 'boolean',
    },
  },
};

const friendStatusMap: Record<
  Required<MiniProfileStoryArgs>['friendStatus'],
  FriendsFriendshipStatusStatus
> = {
  friend: FriendsFriendshipStatusStatus.StatusFriend,
  asked: FriendsFriendshipStatusStatus.StatusFriendRequestSent,
  received: FriendsFriendshipStatusStatus.StatusFriendRequestReceived,
};

export default {
  title: 'Mini Profile',
  component: MiniProfile,
  argTypes,
  args: {
    showRank: true,
  },
  decorators: [
    StoryHelpers.withAuthProvider({ userId: 'someone-else' }),
    addMiniProfileProviderDecorator({ channelId: CHANNEL_ID }),
    addSocialPackageProviderDecorator(),
  ],
  parameters: StoryHelpers.Apollo.addMocks([
    StoryHelpers.Apollo.createMock(
      MiniProfileGameRankChannelDocument,
      {
        channelId: CHANNEL_ID,
      },
      {
        channel: {
          id: CHANNEL_ID,
          gameId: GAME_ID,
          game: {
            id: GAME_ID,
            activeSeasonId: SEASON_ID,
          },
        },
      },
    ),
  ]),
  render: ({ showRank, friendStatus, ...args }: MiniProfileStoryArgs) => {
    const profile = {
      ...helperProfile,
      playedGames: showRank
        ? [
            {
              id: GAME_ID,
              userId: helperProfile.userId,
              seasonId: SEASON_ID,
              game: {
                id: GAME_ID,
                name: 'Superior Game',
              },
              progression: {
                level: 20,
              },
              season: {
                id: SEASON_ID,
                name: 'Beta Season 5',
              },
            },
          ]
        : [],
      friendshipStatus: {
        lastStatusChange: '1070-01-01T00:00:00Z',
        status: friendStatus
          ? friendStatusMap[friendStatus]
          : FriendsFriendshipStatusStatus.StatusUnspecified,
      },
      isNewUsername: !!args.hasNewUsername,
    };

    return (
      <MiniProfile
        {...args}
        profile={profile}
      />
    );
  },
};

export const Default = {};

export const withGift = {
  args: {
    showGiftButton: true,
  },
};

export const isFollowing = {
  parameters: StoryHelpers.Apollo.addMocks([
    StoryHelpers.Apollo.createMock(
      MiniProfileFollowingStateDocument,
      {
        channelId: CHANNEL_ID,
        userId: helperProfile.userId,
      },
      {
        channelFollowerStatus: {
          following: true,
          followedAt: '1070-01-01T00:00:00Z',
        },
      },
    ),
  ]),
};
