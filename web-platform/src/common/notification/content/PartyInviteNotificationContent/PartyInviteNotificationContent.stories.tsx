import { StoryHelpers } from '@noice-com/common-ui';
import { PartyInviteError } from '@noice-com/social';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { NotificationListItem } from '../../NotificationListItem';

import {
  PartyInviteNotificationContent,
  PartyInviteNotificationContentProps,
} from './PartyInviteNotificationContent';

const meta: Meta<typeof PartyInviteNotificationContent> = {
  title: 'Notifications/PartyInviteNotificationContent',
  component: PartyInviteNotificationContent,
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

const basicPartyInviteData: PartyInviteNotificationContentProps = {
  currentStreamId: null,
  party: {
    id: 'testParty1',
    streamId: 'testStream1',
  },
  notificationId: 'testNotificationId1',
  partyLeader: {
    userId: 'testUserId1',
    userTag: 'TestUser1',
    avatars: {
      avatar2D: 'https://metalshockfinland.files.wordpress.com/2022/07/angus-mcsix.jpg',
    },
  },
  onAccept: () => {},
};

const partyInStreamInviteData: PartyInviteNotificationContentProps = {
  ...basicPartyInviteData,
  party: {
    ...basicPartyInviteData.party,
    channel: {
      id: 'testChannelId',
      name: 'TestChannelName',
    },
  },
};

const playerAndPartyInStreamInviteData: PartyInviteNotificationContentProps = {
  ...basicPartyInviteData,
  currentStreamId: 'testStream1',
  party: {
    ...basicPartyInviteData.party,
    channel: {
      id: 'testChannelId',
      name: 'TestChannelName',
    },
  },
};

const playerInStreamInviteData: PartyInviteNotificationContentProps = {
  ...basicPartyInviteData,
  currentStreamId: 'testStream1',
  party: {
    ...basicPartyInviteData.party,
    streamId: '',
  },
};

const basicWithErrorInviteData: PartyInviteNotificationContentProps = {
  ...basicPartyInviteData,
  error: PartyInviteError.PartyFull,
};

export default meta;
type Story = StoryObj<typeof PartyInviteNotificationContent>;

export const LightBasic: Story = {
  args: basicPartyInviteData,
};

export const DarkBasic: Story = {
  args: {
    ...basicPartyInviteData,
    theme: 'dark',
  },
};

export const LightBasicWithError: Story = {
  args: basicWithErrorInviteData,
};

export const DarkBasicWithError: Story = {
  args: {
    ...basicWithErrorInviteData,
    theme: 'dark',
  },
};

export const LightPartyInStream: Story = {
  args: partyInStreamInviteData,
};

export const DarkPartyInStream: Story = {
  args: {
    ...partyInStreamInviteData,
    theme: 'dark',
  },
};

export const LightPlayerAndPartyInStream: Story = {
  args: playerAndPartyInStreamInviteData,
};

export const DarkPlayerAndPartyInStream: Story = {
  args: {
    ...playerAndPartyInStreamInviteData,
    theme: 'dark',
  },
};

export const LightPlayerInStream: Story = {
  args: playerInStreamInviteData,
};

export const DarkPlayerInStream: Story = {
  args: {
    ...playerInStreamInviteData,
    theme: 'dark',
  },
};
