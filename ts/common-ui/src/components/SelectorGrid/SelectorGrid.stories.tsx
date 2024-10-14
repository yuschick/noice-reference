import type { Meta } from '@storybook/react';

import { SelectorGrid } from './SelectorGrid';

const meta: Meta<typeof SelectorGrid> = {
  title: 'SelectorGrid',
  component: SelectorGrid,
  argTypes: {},
  decorators: [
    (Story) => (
      <div style={{ inlineSize: '80vw' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

export const Default = {
  args: {
    pageSize: 12,
    rowSize: 4,
    label: 'Choose avatar',
    values: [
      {
        id: 'basic-female',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/basic01-set-female-face0000.png',
      },
      {
        id: 'basic-male',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/basic01-set-male-face0000.png',
      },
      {
        id: 'badger-female',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/badger-set-female-face0000.png',
      },
      {
        id: 'badger-male',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/badger-set-male-face0000.png',
      },
      {
        id: 'catrina-female',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/catrina-set-female-face0000.png',
      },
      {
        id: 'catrina-male',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/catrina-set-male-face0000.png',
      },
      {
        id: 'hacker-female',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/hacker-set-female-face0000.png',
      },
      {
        id: 'hacker-male',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/hacker-set-male-face0000.png',
      },
      {
        id: 'hatter-female',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/hatter-set-female-face0000.png',
      },
      {
        id: 'hatter-male',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/hatter-set-male-face0000.png',
      },
      {
        id: 'hockey-female',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/hockey-set-female-face0000.png',
      },
      {
        id: 'hockey-male',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/hockey-set-male-face0000.png',
      },
      {
        id: 'magician-female',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/magician-set-female-face0000.png',
      },
      {
        id: 'magician-male',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/magician-set-male-face0000.png',
      },
      {
        id: 'piano-female',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/piano-set-female-face0000.png',
      },
      {
        id: 'piano-male',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/piano-set-male-face0000.png',
      },
      {
        id: 'pika-female',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/pika-set-female-face0000.png',
      },
      {
        id: 'pika-male',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/pika-set-male-face0000.png',
      },
      {
        id: 'scream-female',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/scream-set-female-face0000.png',
      },
      {
        id: 'scream-male',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/scream-set-male-face0000.png',
      },
      {
        id: 'stonk-female',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/stonk-set-female-face0000.png',
      },
      {
        id: 'stonk-male',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/stonk-set-male-face0000.png',
      },
      {
        id: 'technomonkey-female',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/technomonkey-set-female-face0000.png',
      },
      {
        id: 'technomonkey-male',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/technomonkey-set-male-face0000.png',
      },
      {
        id: 'unicorn-female',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/unicorn-set-female-face0000.png',
      },
      {
        id: 'unicorn-male',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/unicorn-set-male-face0000.png',
      },
      {
        id: 'warrior-female',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/warrior-set-female-face0000.png',
      },
      {
        id: 'warrior-male',
        imgSrc:
          'https://client-assets-cdn.gcp.dev.noice.com/avatars/warrior-set-male-face0000.png',
      },
    ],
  },
};

export const SmallAmountOfValues = {
  args: {
    ...Default.args,
    values: [...(Default.args.values?.slice(0, 5) ?? [])],
  },
};
