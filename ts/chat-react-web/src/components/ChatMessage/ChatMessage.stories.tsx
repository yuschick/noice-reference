import { ChatMessageModel, ChatSenderInfoModel } from '@noice-com/chat-react-core';
import { StoryHelpers } from '@noice-com/common-ui';
import { EntityState } from '@noice-com/schemas/api/entity.pb';
import { BadgeType } from '@noice-com/schemas/badge/badge.pb';
import { ModerationStatus } from '@noice-com/schemas/chat/chat.pb';
import { Color } from '@noice-com/schemas/profile/profile.pb';
import { MiniProfileDocument } from '@noice-com/social';
import type { Meta } from '@storybook/react';

import { ChatMessage } from './ChatMessage';

import {
  chatMessageAvatarTypeOptions,
  chatMessageTimestampTypeOptions,
} from '@chat-common/settings';
import { BadgeBadgeType } from '@chat-gen';

const meta: Meta<typeof ChatMessage> = {
  title: 'ChatMessage',
  component: ChatMessage,
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    timestampType: {
      control: { type: 'select' },
      options: chatMessageTimestampTypeOptions,
    },
    avatarType: {
      control: { type: 'select' },
      options: chatMessageAvatarTypeOptions,
    },
  },
};

export default meta;

const emojiList: { [key: string]: { label: string; source: string; itemId: string } } = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  LUL: {
    label: ':LUL:',
    source: `${NOICE.CDN_URL}/emotes/lul.png`,
    itemId: 'emoji-lul',
  },
  noice: {
    label: ':noice:',
    source: `${NOICE.CDN_URL}/emotes/noice.png`,
    itemId: 'emoji-noice',
  },
};

const SENDER_ID = 'sender-id';
const CHANNEL_ID = 'channel-id';

const profile = StoryHelpers.getNewProfile();
const senderInfo: ChatSenderInfoModel = {
  userId: SENDER_ID,
  username: profile.userTag,
  avatar2D: profile.avatars?.avatar2D ?? '',
  badges: [],
  preferredColor: Color.COLOR_UNSPECIFIED,
};

const chatMessage: ChatMessageModel = {
  chatItemType: 'ChatMessage',
  senderId: SENDER_ID,
  chatId: 'chat-id',
  messageId: 'message-id',
  moderationStatus: ModerationStatus.MODERATION_STATUS_APPROVED,
  state: EntityState.ENTITY_STATE_UNSPECIFIED,
  createdAt: new Date(Date.now() - 1000).toISOString(),
  content: {
    textContent: {
      text: 'This is a :noice: message !! what is up :LUL: lol @Heta Cillum irure tempor velit irure dolore quis in culpa deserunt reprehenderit ad do quis.',
      attachments: [
        {
          ...emojiList.noice,
          startIndex: 10,
          endIndex: 16,
        },
        {
          ...emojiList.LUL,
          startIndex: 40,
          endIndex: 44,
        },
      ],
      links: [],
    },
  },
  senderInfo,
};

export const Default = {
  args: {
    chatMessage,
    ownPlayerName: 'Heta',
    channelId: CHANNEL_ID,
    chatProfileSlot: () => null,
    avatarType: 'visible',
  },
  parameters: StoryHelpers.Apollo.addMocks([
    StoryHelpers.Apollo.createMock(
      MiniProfileDocument,
      { userId: SENDER_ID, channelId: CHANNEL_ID },
      {
        profile: { __typename: 'ProfileProfile', ...StoryHelpers.getNewProfile() },
      },
    ),
  ]),
};

const senderInfoWithBadges: ChatSenderInfoModel = {
  ...senderInfo,
  badges: [
    {
      type: BadgeType.TYPE_CHANNEL_MODERATOR,
      level: 0,
    },
    {
      type: BadgeType.TYPE_STREAMER,
      level: 0,
    },
  ],
};

export const WithBadges = {
  ...Default,
  args: {
    ...Default.args,
    chatMessage: {
      ...Default.args.chatMessage,
      senderInfo: senderInfoWithBadges,
    },
  },
  parameters: StoryHelpers.Apollo.addMocks([
    StoryHelpers.Apollo.createMock(
      MiniProfileDocument,
      { userId: SENDER_ID, channelId: CHANNEL_ID },
      {
        profile: {
          __typename: 'ProfileProfile',
          ...StoryHelpers.getNewProfile(),
          badges: [
            {
              __typename: 'BadgeBadge',
              type: BadgeBadgeType.TypeChannelModerator,
              level: 0,
            },
            {
              __typename: 'BadgeBadge',
              type: BadgeBadgeType.TypeStreamer,
              level: 0,
            },
          ],
        },
      },
    ),
  ]),
};

const chatMessageWithLink: ChatMessageModel = {
  ...chatMessage,
  content: {
    textContent: {
      text: 'This is a message with a link https://www.noice.com :noice:',
      attachments: [
        {
          ...emojiList.noice,
          startIndex: 52,
          endIndex: 58,
        },
      ],
      links: [
        {
          startIndex: 30,
          endIndex: 50,
          url: 'https://www.noice.com',
        },
      ],
    },
  },
};

export const WithLink = {
  ...Default,
  args: {
    ...Default.args,
    chatMessage: chatMessageWithLink,
  },
};
