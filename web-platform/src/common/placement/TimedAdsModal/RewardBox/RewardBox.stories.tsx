import { StoryFn } from '@storybook/react';

import { RewardBox, Props } from './RewardBox';

import { RarityRarity } from '@gen';

export default {
  title: 'TimedAds/RewardBox',
  argTypes: {
    open: {
      name: 'Open',
      control: { type: 'boolean' },
      defaultValue: false,
      description: 'Is reward box open',
    },
    rarity: {
      name: 'Rarity',
      control: { type: 'select' },
      defaultValue: RarityRarity.RarityRare,
      description: 'Rarity of the reward box',
      options: Object.values(RarityRarity),
    },
  },
  component: RewardBox,
};

const Template: StoryFn<Props> = (args) => (
  <div style={{ inlineSize: '350px', blockSize: '350px' }}>
    <RewardBox {...args} />
  </div>
);

export const Default = {
  render: Template,

  args: {
    open: false,
    rarity: RarityRarity.RarityRare,
  },
};
