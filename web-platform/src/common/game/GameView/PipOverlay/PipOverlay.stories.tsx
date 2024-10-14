import { StoryHelpers } from '@noice-com/common-ui';
import { Meta, StoryFn } from '@storybook/react';

import { PipOverlay, Props } from './PipOverlay';

export default {
  title: 'Game View/PipOverlay',
  component: PipOverlay,
  argTypes: {
    ...StoryHelpers.ignoreGraphQLProps(),
  },
} as Meta<typeof PipOverlay>;

const Template: StoryFn<Props> = (args) => (
  <div
    style={{
      width: '417px',
      height: '234px',
      background: '#121212',
      position: 'relative',
      borderRadius: '12px',
    }}
  >
    <PipOverlay {...args} />
  </div>
);

export const Default = {
  render: Template,

  args: {
    name: 'test1',
    title: 'title',
    game: { id: 'fortnite', name: 'Fortnite' },
    logo: NOICE.CDN_URL + '/avatars/05-new.png',
  },
};
