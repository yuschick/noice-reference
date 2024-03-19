import { Meta, StoryObj } from '@storybook/react';

import { LoadingSpinner, loadingSpinnerSizes } from './LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Loading Spinner',
  component: LoadingSpinner,
  tags: ['autodocs'],
  argTypes: {
    ref: {
      description: 'React ref to the wrapping `HTMLDivElement`',
    },
    size: {
      options: loadingSpinnerSizes,
      control: { type: 'select' },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `An accessible loading spinner component for providing feedback during the loading of a page or page content.`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `The loading spinner used without any additional props.`,
      },
    },
  },
};
export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: `Every size of the loading spinner.`,
      },
    },
  },
  render: () => {
    return (
      <div
        style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <LoadingSpinner size="sm" />
        <LoadingSpinner size="md" />
        <LoadingSpinner size="lg" />
      </div>
    );
  },
};
