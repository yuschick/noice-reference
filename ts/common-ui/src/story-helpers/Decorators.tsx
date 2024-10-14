import { StoryContext } from '@storybook/addons';
import { ReactElement } from 'react';

export const decorateForceRerender = (
  Story: () => ReactElement<unknown, string>,
  context: StoryContext,
): JSX.Element => (
  <Story
    key={Date.now()}
    {...context.args}
  />
);
