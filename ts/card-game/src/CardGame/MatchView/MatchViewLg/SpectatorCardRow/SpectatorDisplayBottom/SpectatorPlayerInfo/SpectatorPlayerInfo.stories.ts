import { Meta } from '@storybook/react';

import { SpectatorPlayerInfo } from './SpectatorPlayerInfo';

export default {
  title: 'MatchViewLg/Spectator Card Row/Spectator Player Info',
  component: SpectatorPlayerInfo,
} as Meta<typeof SpectatorPlayerInfo>;

const DUMMY_URL =
  'https://storage.googleapis.com/noice-client-assets-a0767e54/proto/noice-avatars/BasicSets_0.0.0.4/Basic01-Set-Female_Face-fs8.png';

export const Default = {
  args: {
    player: {
      userId: 'example-player',
      displayName: 'bengsfort',
      avatars: {
        avatar2D: DUMMY_URL,
      },
    },
    score: 2000,
  },
};
