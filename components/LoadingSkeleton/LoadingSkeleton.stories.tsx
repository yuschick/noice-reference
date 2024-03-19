import { Meta, StoryObj } from '@storybook/react';

import { LoadingSkeleton } from './LoadingSkeleton';
import styles from './LoadingSkeleton.stories.module.css';

const meta: Meta<typeof LoadingSkeleton> = {
  title: 'Loading Skeleton',
  component: LoadingSkeleton,
  tags: ['autodocs'],
  args: {
    height: 16,
    width: 400,
  },
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Provide a custom className to style each skeleton item',
    },
    count: {
      control: { type: 'number' },
      defaultValue: 1,
      description: 'Number of skeleton items to render',
    },
    direction: {
      control: { type: 'radio', options: ['row', 'column'], if: { arg: 'count' } },
      defaultValue: 'column',
      description: 'Direction of skeleton items',
    },
    gap: {
      control: { type: 'number', if: { arg: 'count' } },
      defaultValue: 8,
      description: 'Gap between skeleton items',
    },
    height: {
      control: { type: 'number' },
      defaultValue: '100%',
      description: 'Height of each skeleton item',
    },
    ref: {
      description: 'React ref to the wrapping `HTMLSpanElement`',
    },
    width: {
      control: { type: 'number' },
      defaultValue: '100%',
      description: 'Width of each skeleton item',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'An accessible way to indicate that content is loading. It uses `aria-live` and `aria-busy` to communicate the loading state to assistive technologies, and has support for reduced motion environments.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof LoadingSkeleton>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `A single loading skeleton.`,
      },
    },
  },
};

export const MultipleSkeletons: Story = {
  args: {
    count: 4,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Render multiple loading skeletons with the `count` prop. You can also adjust the `gap` between each skeleton item.',
      },
    },
  },
  render: ({ ...args }) => (
    <div style={{ color: 'var(--noi-color-text-dark)' }}>
      <p>Default</p>
      <LoadingSkeleton {...args} />
      <p>
        With custom <code>1.5rem</code> gap
      </p>
      <LoadingSkeleton
        {...args}
        count={4}
        gap={24}
      />
    </div>
  ),
};

export const SizedToContainer: Story = {
  args: {
    height: undefined,
    width: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'If no `height` or `width` is provided, the skeleton will fill its container. If providing a `count` value, the skeletons will be fit into the container.',
      },
    },
  },
  render: ({ ...args }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      <div style={{ height: 350, width: 225 }}>
        <LoadingSkeleton {...args} />
      </div>
      <div style={{ height: 350, width: 225 }}>
        <LoadingSkeleton
          count={3}
          {...args}
        />
      </div>
    </div>
  ),
};

export const StyleWithClassname: Story = {
  args: {
    className: styles.customSkeletonItem,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Style the individual skeleton items by providing a `className`. This could be used to include a `borderRadius` or sizing styles, as an example.<br/>Note: Any `className` styles will override any other `height` or `width` values.',
      },
    },
  },
};

export const WrappingRows: Story = {
  args: {
    className: styles.customSkeletonBorderRadius,
    count: 6,
    direction: 'row',
    height: 200,
    width: 200,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The loading skeleton items can be rendered as a row by setting the `direction` prop to `row`. By default, these items will wrap within their container.',
      },
    },
  },
};
