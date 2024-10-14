import { StoryHelpers } from '@noice-com/common-ui';

import { ActiveFriendsList } from './ActiveFriendsList';

export default {
  title: 'ActiveFriendsList',
  component: ActiveFriendsList,
};

export const Default = {
  args: {
    friends: [
      StoryHelpers.getNewProfile(),
      { ...StoryHelpers.getNewProfile(), avatars: undefined },
      StoryHelpers.getNewProfile(),
    ],
    totalAmount: 3,
  },
};

export const ManyFriends = {
  args: {
    friends: Array(4).fill(StoryHelpers.getNewProfile()),
    totalAmount: 36,
  },
};
