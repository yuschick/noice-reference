import { action } from '@storybook/addon-actions';
import { StoryFn } from '@storybook/react';

import { EmojiDrawer, EmojiDrawerProps } from './EmojiDrawer';

export default {
  title: 'Emoji Drawer',
  component: EmojiDrawer,
};

const Template: StoryFn<EmojiDrawerProps> = ({ ...args }) => {
  return <EmojiDrawer {...args} />;
};

export const Drawer = {
  render: Template,

  args: {
    showDrawer: true,
    onEmojiClicked: action('omEmojiClicked'),
    onOutsideClick: action('onOutsideClick'),
  },
};
