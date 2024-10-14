import { action } from '@storybook/addon-actions';
import { StoryFn } from '@storybook/react';

import { ChatInputFormProps, ChatInputForm } from './ChatInputForm';

export default {
  title: 'Chat Input Form',
  component: ChatInputForm,
};

const Template: StoryFn<ChatInputFormProps> = ({ ...args }) => {
  return (
    <div style={{ width: '250px' }}>
      <ChatInputForm {...args} />
    </div>
  );
};

export const Default = {
  render: Template,

  args: {
    sendMessage: action('sendMessage'),
    placeholder: 'Placeholder',
  },
};
