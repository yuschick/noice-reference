import { action } from '@storybook/addon-actions';
import { StoryFn } from '@storybook/react';

import { EmojiInput, EmojiInputProps } from './EmojiInput';

export default {
  title: 'Emoji Input',
  component: EmojiInput,
};

const Template: StoryFn<EmojiInputProps> = ({ ...args }) => {
  return (
    <div style={{ width: '250px' }}>
      <EmojiInput {...args} />
    </div>
  );
};

export const Default = {
  render: Template,

  args: {
    onChange: action('onChange'),
    onEnter: action('onEnter'),
    placeholder: 'Placeholder',
  },
};
