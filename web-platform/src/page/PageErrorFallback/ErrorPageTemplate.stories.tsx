import { StoryFn } from '@storybook/react';

import { ErrorPageTemplate, Props } from './ErrorPageTemplate';

export default {
  title: 'Error Page Template',
  component: ErrorPageTemplate,
};

const Template: StoryFn<Props> = ({ ...args }) => (
  <div style={{ width: '100%' }}>
    <ErrorPageTemplate {...args} />
  </div>
);

export const PageError = {
  render: Template,

  args: {
    title: 'Something went wrong',
    description:
      'There was an issue trying to show you this page. You can try navigating back to it, but if it happens again please let us know about the error below!',
    error: new Error('Internal state imploded'),
  },
};
