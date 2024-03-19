import { Meta, StoryObj } from '@storybook/react';

import { ChannelLogo, channelLogoSizes } from './ChannelLogo';

import { ChannelLiveStatus } from '@common-gen';

const meta: Meta<typeof ChannelLogo> = {
  title: 'Channel Logo',
  component: ChannelLogo,
  tags: ['autodocs'],
  args: {
    channel: {
      liveStatus: ChannelLiveStatus.LiveStatusLive,
      logo: 'https://metalshockfinland.files.wordpress.com/2022/07/angus-mcsix.jpg',
      name: 'Angus McSix',
    },
  },
  argTypes: {
    channel: {
      control: { type: 'object' },
      description: 'The channel containing the logo and channel name to use.',
      required: true,
    },
    showLiveStatus: {
      control: { type: 'boolean' },
      description:
        'Show the offline or online status of the channel. When `true`, offline and online styles will be applied to the component, as well as appending the offline or online status to the `alt` text of the image.',
    },
    size: {
      control: { type: 'select' },
      defaultValue: 'md',
      description: 'Override the default (md) size of the channel logo.',
      options: channelLogoSizes,
    },
  },
  parameters: {
    docs: {
      description: {
        component: `A component to display a Channel's logo with optional on/offline status. This component is heavily based on the [ProfileImage](/docs/common-ui-button--docs) component.`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ChannelLogo>;

export const Default: Story = {
  render: ({ ...args }) => {
    return <ChannelLogo {...args} />;
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: `All of the supported channel logo sizes.`,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div
        style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <ChannelLogo
          {...args}
          size="xs"
        />
        <ChannelLogo
          {...args}
          size="sm"
        />
        <ChannelLogo
          {...args}
          size="md"
        />
        <ChannelLogo
          {...args}
          size="lg"
        />
      </div>
    );
  },
};

export const Placeholder: Story = {
  args: {
    channel: {
      liveStatus: ChannelLiveStatus.LiveStatusLive,
      logo: 'https://wwww.no-image-broken.url',
      name: 'Angus McSix',
    },
  },
  parameters: {
    docs: {
      description: {
        story: `When a channel logo does not exist, or fails to load, the placeholder initials will be shown as a fallback.`,
      },
    },
  },
  render: ({ ...args }) => {
    return <ChannelLogo {...args} />;
  },
};

export const Loading: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: `Render the channel log as a loading state.`,
      },
    },
  },
  render: ({ ...args }) => {
    return <ChannelLogo.Loading {...args} />;
  },
};

export const Offline: Story = {
  args: {
    channel: {
      liveStatus: ChannelLiveStatus.LiveStatusOffline,
      logo: 'https://metalshockfinland.files.wordpress.com/2022/07/angus-mcsix.jpg',
      name: 'Angus McSix',
    },
    showLiveStatus: true,
  },
  parameters: {
    docs: {
      description: {
        story: `Show the channel as being offline. Note that only \`ChannelLiveStatus.LiveStatusLive\` is treated as \`online\`. Every other \`ChannelLiveStatus\` is treated as \`offline\`.`,
      },
    },
  },
  render: ({ ...args }) => {
    return <ChannelLogo {...args} />;
  },
};
export const Online: Story = {
  args: {
    channel: {
      liveStatus: ChannelLiveStatus.LiveStatusLive,
      logo: 'https://metalshockfinland.files.wordpress.com/2022/07/angus-mcsix.jpg',
      name: 'Angus McSix',
    },
    showLiveStatus: true,
  },
  parameters: {
    docs: {
      description: {
        story: `Show the channel as being online.`,
      },
    },
  },
  render: ({ ...args }) => {
    return <ChannelLogo {...args} />;
  },
};
