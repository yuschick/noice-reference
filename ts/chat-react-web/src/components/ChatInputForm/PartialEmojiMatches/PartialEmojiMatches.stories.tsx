import { StoryFn } from '@storybook/react';

import { Props, PartialEmojiMatches } from './PartialEmojiMatches';

export default {
  title: 'Partial Emoji Matches',
  component: PartialEmojiMatches,
};

const Template: StoryFn<Props> = ({ ...args }) => {
  return (
    <div style={{ width: '250px' }}>
      <PartialEmojiMatches {...args} />
    </div>
  );
};

export const Default = {
  render: Template,

  args: {
    showDrawer: true,
    emojiMatches: ['emoji-dogjam', 'emoji-catjam'],
    partialText: 'jam',
    emojiList: {
      'emoji-catjam': {
        itemId: 'emoji-catjam',
        label: ':catJAM:',
        source:
          'https://client-assets-cdn.gcp.dev.noice.com/emotes/noice/emotes_catjam.gif',
      },
      'emoji-dogjam': {
        itemId: 'emoji-dogjam',
        label: ':dogJAM:',
        source:
          'https://client-assets-cdn.gcp.dev.noice.com/emotes/noice/emotes_dogjam.gif',
      },
      'emoji-kappa': {
        itemId: 'emoji-kappa',
        label: ':kappa:',
        source:
          'https://client-assets-cdn.gcp.dev.noice.com/emotes/noice/emotes_kappa.png',
      },
      'emoji-kekw': {
        itemId: 'emoji-kekw',
        label: ':KEKW:',
        source:
          'https://client-assets-cdn.gcp.dev.noice.com/emotes/noice/emotes_kekw.png',
      },
      'emoji-lul': {
        itemId: 'emoji-lul',
        label: ':LUL:',
        source: 'https://client-assets-cdn.gcp.dev.noice.com/emotes/noice/emotes_lul.png',
      },
      'emoji-noice': {
        itemId: 'emoji-noice',
        label: ':noice:',
        source:
          'https://client-assets-cdn.gcp.dev.noice.com/emotes/noice/emotes_noice.png',
      },
      'emoji-notlikethis': {
        itemId: 'emoji-notlikethis',
        label: ':notlikethis:',
        source:
          'https://client-assets-cdn.gcp.dev.noice.com/emotes/noice/emotes_notlikethis.png',
      },
      'emoji-salty': {
        itemId: 'emoji-salty',
        label: ':salty:',
        source:
          'https://client-assets-cdn.gcp.dev.noice.com/emotes/noice/emotes_salty.png',
      },
      'emoji-seemsgood': {
        itemId: 'emoji-seemsgood',
        label: ':seemsgood:',
        source:
          'https://client-assets-cdn.gcp.dev.noice.com/emotes/noice/emotes_seemsgood.png',
      },
    },
  },
};
