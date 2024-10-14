import { StoryHelpers } from '@noice-com/common-ui';
import { action } from '@storybook/addon-actions';
import type { Meta } from '@storybook/react';

import { NotificationListItem } from '../../NotificationListItem';

import { FriendRequestNotificationContent } from './FriendRequestNotificationContent';

const meta: Meta<typeof FriendRequestNotificationContent> = {
  title: 'Notifications/FriendRequestNotificationContent',
  component: FriendRequestNotificationContent,
  decorators: [
    (Story, { args }) => (
      <div style={{ inlineSize: '400px' }}>
        <NotificationListItem
          theme={args.theme}
          onCloseClick={action('close')}
        >
          <Story />
        </NotificationListItem>
      </div>
    ),
  ],
  argTypes: {
    notificationId: StoryHelpers.disableArg(),
    description: StoryHelpers.disableArg(),
    subtext: StoryHelpers.disableArg(),
    icon: StoryHelpers.disableArg(),
  },
};

export default meta;

export const Light = {
  args: {
    senderProfile: StoryHelpers.getNewProfile(),
  },
};

export const Dark = {
  args: {
    ...Light.args,
    theme: 'dark',
  },
};
