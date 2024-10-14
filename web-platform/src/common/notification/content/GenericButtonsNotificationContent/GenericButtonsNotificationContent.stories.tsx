import { CoreAssets } from '@noice-com/assets-core';
import { StoryHelpers } from '@noice-com/common-ui';
import { action } from '@storybook/addon-actions';
import type { Meta } from '@storybook/react';

import { NotificationListItem } from '../../NotificationListItem';

import { GenericButtonsNotificationContent } from './GenericButtonsNotificationContent';

const meta: Meta<typeof GenericButtonsNotificationContent> = {
  title: 'Notifications/GenericButtonsNotificationContent',
  component: GenericButtonsNotificationContent,
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
  },
};

export default meta;

export const Light = {
  args: {
    icon: CoreAssets.Icons.Pants,
    description: 'This is a generic notification',
    subtext: 'This is a subtext',
    acceptButton: {
      content: 'Ok',
    },
    declineButton: {
      content: 'Cancel',
    },
  },
};

export const Dark = {
  args: {
    ...Light.args,
    theme: 'dark',
  },
};
