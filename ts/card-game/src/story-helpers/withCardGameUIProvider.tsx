import { StoryContext } from '@storybook/react';
import { ReactElement } from 'react';

import {
  MockProps,
  MockCardGameUIGameStateProvider,
} from '../context/CardGameUIStateProvider/CardGameUIStateProvider';

export const withCardGameUIProvider =
  (defaults: MockProps = {}) =>
  (Story: () => ReactElement<unknown, string>, context: StoryContext): JSX.Element => {
    return (
      <MockCardGameUIGameStateProvider {...defaults}>
        <Story {...context.args} />
      </MockCardGameUIGameStateProvider>
    );
  };
