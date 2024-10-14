import { ErrorFallbackProps, Icon } from '@noice-com/common-ui';
import { action } from '@storybook/addon-actions';
import { StoryFn } from '@storybook/react';

import { CardGameErrorFallback } from './CardGameErrorFallback';

import { FakeStadium } from '@game-components/FakeStadium';

export default {
  title: 'Card Game Error Fallback',
  component: CardGameErrorFallback,
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

const Template: StoryFn<ErrorFallbackProps> = ({ ...args }) => {
  return (
    <div>
      <Icon icon={FakeStadium} />
      <CardGameErrorFallback {...args} />
    </div>
  );
};

export const Default = {
  render: Template,

  args: {
    error: new Error('Game state imploded'),
    resetErrorBoundary: action('resetErrorBoundary'),
  },
};
