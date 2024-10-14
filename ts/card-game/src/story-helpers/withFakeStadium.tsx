import { Icon } from '@noice-com/common-ui';
import { StoryContext } from '@storybook/react';
import { ReactElement } from 'react';

// eslint-disable-next-line import/no-restricted-paths
import { FakeStadium } from '../components/FakeStadium';

export const withFakeStadium =
  () => (Story: () => ReactElement<unknown, string>, context: StoryContext) => {
    return (
      <div>
        <Icon icon={FakeStadium} />

        <Story {...context.args} />
      </div>
    );
  };
