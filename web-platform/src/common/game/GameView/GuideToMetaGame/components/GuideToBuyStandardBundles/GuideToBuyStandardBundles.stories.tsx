import { Meta, StoryFn } from '@storybook/react';

import { GuideToBuyStandardBundles } from './GuideToBuyStandardBundles';

export default {
  title: 'Guide To Meta Game/Guide To Buy Standard Bundles',
  component: GuideToBuyStandardBundles,
} as Meta<typeof GuideToBuyStandardBundles>;

const Template: StoryFn = ({ ...args }) => {
  return <GuideToBuyStandardBundles {...args} />;
};

export const Default = {
  render: Template,
};
