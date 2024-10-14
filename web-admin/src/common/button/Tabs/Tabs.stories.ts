import { BiGroup, BiBroadcast } from 'react-icons/bi';

import { Tabs } from './Tabs';

export default {
  component: Tabs,
  argTypes: {},
};

export const Default = {
  args: {
    tabs: [
      {
        title: 'Users',
        to: 'users',
        icon: BiGroup,
        type: 'positive',
        totalAmount: 46,
      },
      {
        title: 'Channels',
        to: 'channels',
        icon: BiBroadcast,
        type: 'warning',
        totalAmount: 2,
      },
    ],
  },
};
