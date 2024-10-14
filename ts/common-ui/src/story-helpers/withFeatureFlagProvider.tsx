import { StoryContext } from '@storybook/react';
import { ReactElement } from 'react';

import {
  FeatureFlagMockProps,
  MockFeatureFlagProvider,
} from '../context/FeatureFlagProvider';

export const withFeatureFlagProvider =
  (defaults: FeatureFlagMockProps = {}) =>
  (Story: () => ReactElement<unknown, string>, context: StoryContext): JSX.Element => {
    return (
      <MockFeatureFlagProvider {...defaults}>
        <Story {...context.args} />
      </MockFeatureFlagProvider>
    );
  };
