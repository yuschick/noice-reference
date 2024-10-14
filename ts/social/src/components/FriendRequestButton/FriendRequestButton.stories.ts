import { StoryHelpers } from '@noice-com/common-ui';

import { FriendRequestButton } from './FriendRequestButton';

const profile = StoryHelpers.getNewProfile();

export default {
  title: 'FriendRequestButton',
  component: FriendRequestButton,
  argTypes: {},
  decorators: [StoryHelpers.withAuthProvider({ userId: profile.userId })],
};

export const Default = {
  args: {
    profile,
  },
};
