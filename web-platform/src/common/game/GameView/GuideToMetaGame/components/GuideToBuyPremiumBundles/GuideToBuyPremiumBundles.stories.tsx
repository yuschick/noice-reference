import { Meta, StoryFn } from '@storybook/react';

import { GuideToBuyPremiumBundles } from './GuideToBuyPremiumBundles';

export default {
  title: 'Guide To Meta Game/Guide To Buy Premium Bundles',
  component: GuideToBuyPremiumBundles,
} as Meta<typeof GuideToBuyPremiumBundles>;

const Template: StoryFn = ({ ...args }) => {
  return <GuideToBuyPremiumBundles {...args} />;
};

export const Default = {
  render: Template,
};
