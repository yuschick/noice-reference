import type { Meta, StoryObj } from '@storybook/react';

import { Emotes } from './Emotes';

import { AvatarEmoteDef } from '@stream-types';

const meta: Meta<typeof Emotes> = {
  title: 'Spotlight/EmoteBar',
  component: Emotes,
};

export default meta;
type Story = StoryObj<typeof Emotes>;

const emotes: AvatarEmoteDef[] = [
  {
    icon: 'https://client-assets-cdn.gcp.dev.noice.com/proto/animations/noice/animations_1.1.0/icons/emote-dance-1.png',
    id: 'emote-dance-1',
    name: 'EmoteDance01',
    type: 'emote',
  },
  {
    icon: 'https://client-assets-cdn.gcp.dev.noice.com/proto/animations/noice/animations_1.1.0/icons/emote-bow-1.png',
    id: 'emote-bow-1',
    name: 'EmoteBow01',
    type: 'emote',
  },
  {
    icon: 'https://client-assets-cdn.gcp.dev.noice.com/proto/animations/noice/animations_1.1.0/icons/emote-wave-two-hands-1.png',
    id: 'emote-victory-1',
    name: 'Victory1',
    type: 'emote',
  },
  {
    icon: 'https://client-assets-cdn.gcp.dev.noice.com/proto/animations/noice/animations_1.1.0/icons/emote-yes-1.png',
    id: 'emote-yes-1',
    name: 'EmoteYes01',
    type: 'emote',
  },
  {
    icon: 'https://client-assets-cdn.gcp.dev.noice.com/proto/animations/noice/animations_1.1.0/icons/emote-hero-pose-1.png',
    id: 'emote-heropose-1',
    name: 'EmoteHeroPose01',
    type: 'emote',
  },
];

export const Primary: Story = {
  render: () => (
    <Emotes
      emotes={emotes}
      onEmoteButtonClick={() => {}}
    />
  ),
};
