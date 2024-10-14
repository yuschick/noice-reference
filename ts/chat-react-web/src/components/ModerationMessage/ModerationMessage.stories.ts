import { ModerationMessageStatus } from '@noice-com/chat-react-core';

import { ModerationMessage } from './ModerationMessage';

export default {
  title: 'ModerationMessage',
  component: ModerationMessage,
  argTypes: {},
};

export const Default = {
  args: {
    status: ModerationMessageStatus.AutomodPending,
  },
};
