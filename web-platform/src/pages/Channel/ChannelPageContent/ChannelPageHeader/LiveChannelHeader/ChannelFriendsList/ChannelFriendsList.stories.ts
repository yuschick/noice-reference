import { StoryHelpers } from '@noice-com/common-ui';

import { ChannelFriendsList, PAGE_SIZE } from './ChannelFriendsList';

import { ChannelActiveFriendsDocument } from '@gen';

export default {
  title: 'ChannelFriendsList',
  component: ChannelFriendsList,
};

const CHANNEL_ID = 'channel-id';
const USER_ID = 'user-id';

export const Default = {
  args: {
    channel: {
      id: CHANNEL_ID,
      channelFriends: {
        totalCount: 2,
      },
    },
  },
  decorators: [StoryHelpers.withAuthProvider({ userId: USER_ID })],
  parameters: StoryHelpers.Apollo.addMocks([
    StoryHelpers.Apollo.createMock(
      ChannelActiveFriendsDocument,
      { channelId: CHANNEL_ID, userId: USER_ID, cursor: { first: PAGE_SIZE } },
      {
        friends: {
          users: Array(2)
            .fill(null)
            .map((_) => {
              const profile = StoryHelpers.getNewProfile();

              return {
                profile,
                userId: profile.userId,
              };
            }),
        },
      },
    ),
  ]),
};

export const ManyFriends = {
  args: {
    channel: {
      id: CHANNEL_ID,
      channelFriends: {
        totalCount: 15,
      },
    },
  },
  decorators: [StoryHelpers.withAuthProvider({ userId: USER_ID })],
  parameters: StoryHelpers.Apollo.addMocks([
    StoryHelpers.Apollo.createMock(
      ChannelActiveFriendsDocument,
      { channelId: CHANNEL_ID, userId: USER_ID, cursor: { first: PAGE_SIZE } },
      {
        friends: {
          users: Array(PAGE_SIZE)
            .fill(null)
            .map((_) => {
              const profile = StoryHelpers.getNewProfile();

              return {
                profile,
                userId: profile.userId,
              };
            }),
          pageInfo: {
            hasNextPage: true,
          },
        },
      },
    ),
  ]),
};
