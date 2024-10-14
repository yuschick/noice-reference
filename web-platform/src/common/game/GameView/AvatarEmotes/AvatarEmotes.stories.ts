import { StoryHelpers } from '@noice-com/common-ui';
import { Meta } from '@storybook/react';

import { AvatarEmotes } from './AvatarEmotes';
import { AvatarEmoteDef, RecentlyUsedEmote } from './types';

export default {
  title: 'AvatarEmotes',
  component: AvatarEmotes,
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof AvatarEmotes>;

const excitedEmote: AvatarEmoteDef = {
  id: 'excited',
  name: 'Excited',
  icon: `${NOICE.CDN_URL}/emotes/emote-excited-1.png`,
  type: 'emote',
};

const rumbaEmote: AvatarEmoteDef = {
  id: 'rumba',
  name: 'Rumba',
  icon: `${NOICE.CDN_URL}/emotes/emote-fishing-1.png`,
  type: 'emote',
};

const danceEmote: AvatarEmoteDef = {
  id: 'dance',
  name: 'Dance',
  icon: `${NOICE.CDN_URL}/emotes/emote-silly-dancing-1.png `,
  type: 'emote',
};

const emoteList: { [key: string]: { label: string; source: string; itemId: string } } = {
  catJAM: {
    label: ':catjam:',
    source: `${NOICE.CDN_URL}/emotes/catjam.gif`,
    itemId: 'emoji-catjam',
  },
  noice: {
    label: ':noice:',
    source: `${NOICE.CDN_URL}/emotes/noice.png`,
    itemId: 'emoji-noice',
  },
};

const recentlyUsed: RecentlyUsedEmote[] = [
  {
    ...excitedEmote,
    keyBinding: '1',
  },
  {
    id: `${StoryHelpers.getNewId()}`,
    name: 'noice',
    icon: emoteList['noice'].source,

    type: 'emoji',
    keyBinding: '2',
  },
  {
    id: `${StoryHelpers.getNewId()}`,
    name: 'catJAM',
    icon: emoteList['catJAM'].source,
    type: 'emoji',
    keyBinding: '3',
  },
  {
    ...rumbaEmote,
    keyBinding: '4',
  },
];

const emojis: AvatarEmoteDef[] = Object.keys(emoteList).map((emote) => {
  const def = emoteList[emote];

  return {
    id: `${StoryHelpers.getNewId()}`,
    name: emote,
    icon: def.source,
    type: 'emoji',
  };
});

export const Default = {
  args: {
    recentlyUsed,
    emojis,
    emotes: [excitedEmote, rumbaEmote, danceEmote],
  },
};

export const ALotOfEmojis = {
  args: {
    recentlyUsed,
    emojis: [...emojis, ...emojis, ...emojis].map((item) => ({
      ...item,
      id: `${StoryHelpers.getNewId()}`,
    })),
    emotes: [excitedEmote, rumbaEmote, danceEmote],
  },
};

export const MissingIcon = {
  args: {
    recentlyUsed: recentlyUsed.map((item, index) =>
      index === 0 ? { ...item, icon: '' } : item,
    ),
    emojis: emojis,
    emotes: [excitedEmote, rumbaEmote, danceEmote],
  },
};

export const Loading = {
  args: {
    recentlyUsed: [],
    emojis: [],
    emotes: [],
    loading: true,
  },
};
