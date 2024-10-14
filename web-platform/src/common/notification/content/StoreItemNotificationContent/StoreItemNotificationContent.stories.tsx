import { StoryHelpers } from '@noice-com/common-ui';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { NotificationListItem } from '../../NotificationListItem';

import { StoreItemNotificationContent } from './StoreItemNotificationContent';

import { StoreV2ItemType } from '@gen';

const standardStoreItem = {
  name: 'Standard Medium',
  type: StoreV2ItemType.ItemTypeStandardCardBundle,
};

const meta: Meta<typeof StoreItemNotificationContent> = {
  title: 'Notifications/StoreItemNotificationContent',
  component: StoreItemNotificationContent,
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
type Story = StoryObj<typeof StoreItemNotificationContent>;

export const Light: Story = {
  args: {
    storeItem: standardStoreItem,
  },
};

export const Dark: Story = {
  args: {
    ...Light.args,
    theme: 'dark',
  },
};
