import { Meta, StoryObj } from '@storybook/react';

import { ProfileImage, profileImageSizes } from './ProfileImage';

import { ProfilePresenceStatus } from '@common-gen';

const meta: Meta<typeof ProfileImage> = {
  title: 'ProfileImage',
  component: ProfileImage,
  tags: ['autodocs'],
  args: {
    profile: {
      avatars: {
        avatar2D: 'https://metalshockfinland.files.wordpress.com/2022/07/angus-mcsix.jpg',
      },
      userTag: 'Angus McSix',
      onlineStatus: ProfilePresenceStatus.PresenceStatusOnline,
    },
  },
  argTypes: {
    profile: {
      control: { type: 'object' },
      description: 'The profile containing the user name and profile image to use.',
      required: true,
    },
    showOnlineStatus: {
      control: { type: 'boolean' },
      description:
        'Show the offline or online status of the account. This will take the current `onlineStatus` value from the profile and render accordingly. In this example, `profile.onlineStatus` is set to `PresenceStatusOnline`.',
    },
    size: {
      control: { type: 'select' },
      defaultValue: 'md',
      description: 'Override the default (md) size of the profile image.',
      options: profileImageSizes,
    },
  },
  parameters: {
    docs: {
      description: {
        component: `A profile image to be shown for channels and friends with optional online/offline status indicators.`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProfileImage>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `The default profile image to be used as a static image without any status-related styles.`,
      },
    },
  },
  render: ({ ...args }) => {
    return <ProfileImage {...args} />;
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: `All of the supported profile image sizes.`,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div
        style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <ProfileImage
          {...args}
          size="xs"
        />
        <ProfileImage
          {...args}
          size="sm"
        />
        <ProfileImage
          {...args}
          size="md"
        />
        <ProfileImage
          {...args}
          size="lg"
        />
      </div>
    );
  },
};

export const Placeholder: Story = {
  args: {
    profile: {
      avatars: {
        avatar2D: '',
      },
      userTag: 'Angus McSix',
      onlineStatus: ProfilePresenceStatus.PresenceStatusOnline,
    },
  },
  parameters: {
    docs: {
      description: {
        story: `When a profile image does not exist, or fails to load, the placeholder will be shown as a fallback.`,
      },
    },
  },
  render: ({ ...args }) => {
    return <ProfileImage {...args} />;
  },
};

export const Loading: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: `Render the avatar as a loading state.`,
      },
    },
  },
  render: ({ ...args }) => {
    return <ProfileImage.Loading {...args} />;
  },
};

export const Offline: Story = {
  args: {
    showOnlineStatus: true,
    profile: {
      avatars: {
        avatar2D: 'https://metalshockfinland.files.wordpress.com/2022/07/angus-mcsix.jpg',
      },
      userTag: 'Angus McSix',
      onlineStatus: ProfilePresenceStatus.PresenceStatusOffline,
    },
  },
  parameters: {
    docs: {
      description: {
        story: `Show the account as being offline. Offline status is shown when the profile \`onlineStatus\` is not \`PresenceStatusOnline\`.`,
      },
    },
  },
  render: ({ ...args }) => {
    return <ProfileImage {...args} />;
  },
};
export const Online: Story = {
  args: {
    showOnlineStatus: true,
  },
  parameters: {
    docs: {
      description: {
        story: `Show the account as being online. This can only be shown if the account opts into sharing their online status.`,
      },
    },
  },
  render: ({ ...args }) => {
    return <ProfileImage {...args} />;
  },
};
