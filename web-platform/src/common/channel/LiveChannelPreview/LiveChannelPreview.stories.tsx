import { StoryHelpers } from '@noice-com/common-ui';
import { Meta, StoryObj } from '@storybook/react';

import { LiveChannelPreview } from './LiveChannelPreview';

import { ChannelLiveStatus } from '@gen';

const channel = {
  channelFriends: {
    totalCount: 0,
    users: [],
  },
  currentStreamId: 'stream-id',
  features: {
    noicePredictions: {
      enabled: false,
    },
  },
  following: false,
  game: {
    id: 'fortnite',
    name: 'Fortnite',
    activeSeason: {
      id: 'season-1',
      seasonBreak: false,
      seasonBreakReason: '',
    },
  },
  id: 'a5da90b3-1c69-40b2-887e-8958d858307b',
  liveStatus: ChannelLiveStatus.LiveStatusLive,
  logo: NOICE.CDN_URL + '/avatars/05-new.png',
  name: 'McSix',
  thumbnail: 'https://client-assets-cdn.gcp.dev.noice.com/stream-thumbnails/05-new.png',
  title: 'McSix is playing Fortnite',
  viewerCount: 100,
  matureRatedContent: false,
};

const meta: Meta<typeof LiveChannelPreview> = {
  title: 'LiveChannelPreview',
  component: LiveChannelPreview,
  parameters: {
    docs: {
      description: {
        component: ``,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof LiveChannelPreview>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: ``,
      },
    },
  },
  render: () => {
    return (
      <div style={{ inlineSize: 'clamp(300px, 100vi, 500px)' }}>
        <LiveChannelPreview channel={channel} />
      </div>
    );
  },
};

export const Following: Story = {
  args: {
    channel: { ...channel, following: true },
  },
  parameters: {
    docs: {
      description: {
        story: ``,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div style={{ inlineSize: 'clamp(300px, 100vi, 500px)' }}>
        <LiveChannelPreview {...args} />
      </div>
    );
  },
};

export const PredictionsEnabled: Story = {
  args: {
    channel: {
      ...channel,
      activeStream: { streamId: 'streamId', noicePredictionsEnabled: true },
    },
  },
  parameters: {
    docs: {
      description: {
        story: ``,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div style={{ inlineSize: 'clamp(300px, 100vi, 500px)' }}>
        <LiveChannelPreview {...args} />
      </div>
    );
  },
};

export const WithFriends: Story = {
  args: {
    channel: {
      ...channel,
      activeStream: { streamId: 'streamId', noicePredictionsEnabled: true },
      channelFriends: {
        totalCount: 14,
        users: Array(14)
          .fill(null)
          .map(() => ({
            userId: `${StoryHelpers.getNewId()}`,
            profile: StoryHelpers.getNewProfile(),
          })),
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: ``,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div style={{ inlineSize: 'clamp(300px, 100vi, 500px)' }}>
        <LiveChannelPreview {...args} />
      </div>
    );
  },
};

export const LongStreamTitle: Story = {
  parameters: {
    docs: {
      description: {
        story: ``,
      },
    },
  },
  args: {
    channel: {
      ...channel,
      title: 'Scooby dooby doo 🎷 where are you 🎷 we got some work to do naaaoooooooow',
    },
  },
  render: ({ ...args }) => {
    return (
      <div style={{ inlineSize: 'clamp(300px, 100vi, 500px)' }}>
        <LiveChannelPreview {...args} />
      </div>
    );
  },
};

export const MatureRatedContent: Story = {
  parameters: {
    docs: {
      description: {
        story: ``,
      },
    },
  },
  args: {
    channel: {
      ...channel,
      matureRatedContent: true,
    },
  },
  render: ({ ...args }) => {
    return (
      <div style={{ inlineSize: 'clamp(300px, 100vi, 500px)' }}>
        <LiveChannelPreview {...args} />
      </div>
    );
  },
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story: ``,
      },
    },
  },
  render: () => {
    return (
      <div style={{ inlineSize: 'clamp(300px, 100vi, 500px)' }}>
        <LiveChannelPreview.Loading />
      </div>
    );
  },
};
