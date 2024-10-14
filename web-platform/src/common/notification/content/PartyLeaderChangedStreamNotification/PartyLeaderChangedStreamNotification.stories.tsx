import { CoreAssets } from '@noice-com/assets-core';
import { StoryHelpers } from '@noice-com/common-ui';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { NotificationListItem } from '../../NotificationListItem';

import {
  PartyLeaderChangedStreamNotification,
  PartyLeaderChangedStreamNotificationProps,
} from './PartyLeaderChangedStreamNotification';

const meta: Meta<typeof PartyLeaderChangedStreamNotification> = {
  title: 'Notifications/PartyLeaderChangedStream',
  component: PartyLeaderChangedStreamNotification,
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

const basicData: PartyLeaderChangedStreamNotificationProps = {
  notificationId: 'testNotification1',
  channelName: 'ChannelName',
  leaderName: 'PartyLeaderName',
  countdownEndTime: new Date(new Date().getTime() + 5000),
  icon: CoreAssets.Icons.Group,
  onCountdownEnd: () => {},
};

const leavingStream: PartyLeaderChangedStreamNotificationProps = {
  ...basicData,
  channelName: null,
};

export default meta;
type Story = StoryObj<typeof PartyLeaderChangedStreamNotification>;

export const LightJoining: Story = {
  args: basicData,
};

export const DarkJoining: Story = {
  args: {
    ...basicData,
    theme: 'dark',
  },
};

export const LightLeaving: Story = {
  args: leavingStream,
};

export const DarkLeaving: Story = {
  args: {
    ...leavingStream,
    theme: 'dark',
  },
};
