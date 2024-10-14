import { CoreAssets } from '@noice-com/assets-core';
import { StoryObj } from '@storybook/react';

import { SidebarChannelLogo, LoadingProps } from './SidebarChannelLogo';

import { ChannelLiveStatus } from '@gen';

export default {
  title: 'Game Sidebar/SidebarChannelLogo',
  component: SidebarChannelLogo,
  argTypes: {},
};

export const Default = {
  args: {
    logo: CoreAssets.Images.StreamerLogo,
    liveStatus: ChannelLiveStatus.LiveStatusLive,
    name: 'Streamer',
  },
};

export const Loading: StoryObj<LoadingProps> = {
  render: (args) => <SidebarChannelLogo.Loading {...args} />,
};
