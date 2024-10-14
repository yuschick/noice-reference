import { CoreAssets } from '@noice-com/assets-core';
import { Meta, StoryFn } from '@storybook/react';

import { VideoPlayer, VideoPlayerProps } from './VideoPlayer';

export default {
  title: 'Video Player',
  component: VideoPlayer,
  argTypes: {
    disabledControls: {
      control: { type: 'check' },
      options: ['seek', 'play', 'mute', 'volume', 'time', 'fullscreen'],
    },
  },
} as Meta<typeof VideoPlayer>;

const Template: StoryFn<VideoPlayerProps> = ({ ...args }) => {
  return <VideoPlayer {...args} />;
};

export const Default = {
  render: Template,
  parameters: {},

  args: {
    src: 'https://noice.com/img/noice-reactions.mp4',
    volume: 0.3,
    title: 'Test title',
    disabledControls: [],
    autoPlay: true,
    clickToPause: true,
  },
};

export const SmallRatio = {
  render: Template,

  args: {
    ...Default.args,
    src: CoreAssets.Videos.VideoCard,
  },
};
