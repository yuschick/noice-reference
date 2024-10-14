import { StoryHelpers } from '@noice-com/common-ui';
import { MiniProfileDocument } from '@noice-com/social';
import { Meta } from '@storybook/react';

import { ChatUserList } from './ChatUserList';

import { MockChannelProvider } from '@common/channel';
import { ChatUserListDocument, ProfileProfile } from '@gen';

const CHAT_ID = 'chat-id';
const CHANNEL_ID = 'channel-id';

const meta: Meta<typeof ChatUserList> = {
  title: 'ChatUserList',
  component: ChatUserList,
  decorators: [
    (Story) => (
      <MockChannelProvider
        channelId={CHANNEL_ID}
        chatId={CHAT_ID}
      >
        <Story />
      </MockChannelProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

const profiles: ProfileProfile[] = [];

const getUser = () => {
  const profile = StoryHelpers.getNewProfile();

  profiles.push(profile);

  return {
    userId: profile.userId,
    user: profile,
  };
};

export default meta;

export const Default = {
  args: {},
  parameters: StoryHelpers.Apollo.addMocks([
    StoryHelpers.Apollo.createMock(
      ChatUserListDocument,
      { chatId: CHAT_ID },
      {
        streamers: {
          users: [getUser()],
        },
        moderators: {
          users: [getUser()],
        },
        viewers: {
          users: [getUser(), getUser(), getUser(), getUser()],
        },
      },
    ),
    ...profiles.map((profile) =>
      StoryHelpers.Apollo.createMock(
        MiniProfileDocument,
        {
          userId: profile.userId,
          channelId: CHANNEL_ID,
          skipModerationData: false,
        },
        {
          profile,
          channelBanUserStatus: {
            userId: profile.userId,
            channelId: CHANNEL_ID,
            banned: false,
            appeal: null,
            bannedAt: null,
            violation: 'VIOLATION_UNSPECIFIED',
            description: '',
            moderator: null,
          },

          chatUserStatus: {
            muted: false,
            muteDuration: null,
          },
        },
      ),
    ),
  ]),
};
