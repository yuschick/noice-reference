import { UserBadge } from './UserBadge';

import { BadgeBadgeType } from '@social-gen';

export default {
  title: 'UserBadge',
  component: UserBadge,
  argTypes: {
    badgeType: {
      options: Object.values(BadgeBadgeType),
      control: { type: 'select' },
    },
  },
};

export const Default = {
  args: {
    badgeType: BadgeBadgeType.TypeStreamer,
  },
};
