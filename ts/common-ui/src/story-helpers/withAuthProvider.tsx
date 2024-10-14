import { StoryContext } from '@storybook/react';
import { ReactElement } from 'react';

import { MockProps, MockAuthProvider } from '../context/AuthProvider';

export const withAuthProvider =
  (defaults: MockProps = {}) =>
  (Story: () => ReactElement<unknown, string>, context: StoryContext): JSX.Element => {
    return (
      <MockAuthProvider {...defaults}>
        <Story {...context.args} />
      </MockAuthProvider>
    );
  };
