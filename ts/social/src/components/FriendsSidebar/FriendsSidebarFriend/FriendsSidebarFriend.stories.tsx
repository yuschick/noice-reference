import { StoryHelpers } from '@noice-com/common-ui';

import { FriendsSidebarFriend } from './FriendsSidebarFriend';

import { ProfilePresenceStatus } from '@social-gen';

export default {
  title: 'FriendsSidebarFriend',
  component: FriendsSidebarFriend,
};

const onlineFriend = {
  profile: {
    ...StoryHelpers.getNewProfile(),
    onlineStatus: ProfilePresenceStatus.PresenceStatusOnline,
  },
  lastStatusChange: '2023-05-23T13:18:54Z',
};

const offlineFriend = {
  profile: {
    ...StoryHelpers.getNewProfile(),
    onlineStatus: ProfilePresenceStatus.PresenceStatusOffline,
  },
  lastStatusChange: '2023-05-23T13:18:54Z',
};

export const MinimizedOnline = {
  args: {
    friend: onlineFriend,
    minimized: true,
  },
};

export const MinimizedOffline = {
  args: {
    friend: offlineFriend,
    minimized: true,
  },
};

export const ExpandedOnline = {
  args: {
    friend: onlineFriend,
  },
};

export const ExpandedOffline = {
  args: { friend: offlineFriend },
};

export const Loading = {
  render: () => <FriendsSidebarFriend.Loading />,
};
