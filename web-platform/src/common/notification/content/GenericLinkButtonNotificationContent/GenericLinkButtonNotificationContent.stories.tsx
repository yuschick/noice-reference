import { CoreAssets } from '@noice-com/assets-core';
import { StoryHelpers } from '@noice-com/common-ui';
import { action } from '@storybook/addon-actions';
import type { Meta } from '@storybook/react';

import { NotificationListItem } from '../../NotificationListItem';

import { GenericLinkButtonNotificationContent } from './GenericLinkButtonNotificationContent';

const meta: Meta<typeof GenericLinkButtonNotificationContent> = {
  title: 'Notifications/GenericLinkButtonNotificationContent',
  component: GenericLinkButtonNotificationContent,
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
    buttonLink: {
      content: 'Click me',
      to: '/some-link',
    },
  },
};

export const Dark = {
  args: {
    ...Light.args,
    theme: 'dark',
  },
};

export const WithDismissButton = {
  args: {
    ...Light.args,
    dismissButton: {
      content: 'Dismiss',
    },
  },
};
