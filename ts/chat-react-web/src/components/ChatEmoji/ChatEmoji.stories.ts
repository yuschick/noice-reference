import { ChatEmoji } from './ChatEmoji';

export default {
  title: 'ChatEmoji',
  component: ChatEmoji,
  argTypes: {},
};

export const Default = {
  args: {
    emote: ':catjam:',
    source: 'https://client-assets-cdn.gcp.dev.noice.com/emotes/catjam.gif',
  },
};
