import { StoryFn } from '@storybook/react';

import { OfflineChannelLink } from './OfflineChannelLink';

export default {
  title: 'OfflineChannelLink',
  component: OfflineChannelLink,
  argTypes: {},
};

export const Default = {
  args: {
    channel: {
      id: 'a5da90b3-1c69-40b2-887e-8958d858307b',
      name: 'test1',
      game: { id: 'fortnite', name: 'Fortnite' },
      logo: NOICE.CDN_URL + '/avatars/05-new.png',
      viewerCount: 100,
      offlineBanner: NOICE.CDN_URL + '/banners/jenix-1.jpg',
    },
  },
};

export const Fallback = {
  args: {
    channel: {
      id: 'a5da90b3-1c69-40b2-887e-8958d858307b',
      name: 'test1',
      game: { id: 'fortnite', name: 'Fortnite' },
      logo: NOICE.CDN_URL + '/avatars/05-new.png',
      viewerCount: 100,
    },
  },
};

export const OfflineDefault = {
  args: {
    channel: {
      id: 'a5da90b3-1c69-40b2-887e-8958d858307b',
      name: 'test1',
      game: { id: 'fortnite', name: 'Fortnite' },
      logo: NOICE.CDN_URL + '/avatars/05-new.png',
      viewerCount: 100,
      offlineBanner: NOICE.CDN_URL + '/banners/jenix-1.jpg',
    },
    showAs: 'offline',
  },
};

export const OfflineFallback = {
  args: {
    channel: {
      id: 'a5da90b3-1c69-40b2-887e-8958d858307b',
      name: 'test1',
      game: { id: 'fortnite', name: 'Fortnite' },
      logo: NOICE.CDN_URL + '/avatars/05-new.png',
      viewerCount: 100,
    },
    showAs: 'offline',
  },
};

export const Loading: StoryFn = () => <OfflineChannelLink.Loading />;
