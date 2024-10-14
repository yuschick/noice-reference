import { StoryFn } from '@storybook/react';

import { DragAndDropWrapper, Props } from './DragAndDropWrapper';

export default {
  title: 'DragAndDropWrapper',
  component: DragAndDropWrapper,
  argTypes: {},
};

const Template: StoryFn<Props> = (args) => (
  <DragAndDropWrapper {...args}>
    <div
      style={{
        width: '80px',
        height: '80px',
        backgroundColor: 'var(--noi-color-violet-main',
      }}
    >
      Some content
    </div>
  </DragAndDropWrapper>
);

export const Default = {
  render: Template,
  args: {},
};

export const Loading = {
  render: Template,

  args: {
    loading: true,
  },
};
