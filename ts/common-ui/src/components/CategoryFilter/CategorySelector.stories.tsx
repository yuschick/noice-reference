import { Meta, StoryObj } from '@storybook/react';

import { CategoryFilter } from './CategoryFilter';

const data = [
  'Fortnite Creators',
  'Dead By Daylight Creators',
  'Valorant Creators',
  'DOTA 2 Creators',
  'League of Legends Creators',
  'Apex Legends Creators',
];

const meta: Meta<typeof CategoryFilter> = {
  title: 'Category Filter',
  component: CategoryFilter,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component: `The CategoryFilter component is used to filter content based on a category. The wrapper will stretch to fill its container, but if its content is too long, the ability to scroll horizontally will be enabled. Either tne \`CategoryFilter.Button\` and/or \`CategoryFilter.Link\` components can be used to create the items within the selector.`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CategoryFilter>;

type Props = {
  count?: number;
  loading?: boolean;
};

function DefaultFilter({ count, loading = false }: Props) {
  const items = count ? data.slice(0, count) : data;

  return (
    <div
      style={{
        minInlineSize: '500px',
      }}
    >
      <CategoryFilter
        loading={loading}
        title="Games Filter"
      >
        {items.map((item, index) => (
          <CategoryFilter.Link
            isSelected={index === 0}
            key={item}
            to="/"
          >
            {item}
          </CategoryFilter.Link>
        ))}
      </CategoryFilter>
    </div>
  );
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `This is a standard example of the CategoryFilter with multiple items. Resize the browser window to see the horizontal scrolling functionality.`,
      },
    },
  },
  render: () => DefaultFilter({ count: 5 }),
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story: `The loading state of the CategoryFilter using the LoadingSkeleton component.`,
      },
    },
  },
  render: () => DefaultFilter({ count: 5, loading: true }),
};

export const FewItems: Story = {
  parameters: {
    docs: {
      description: {
        story: `This is an example of the CategoryFilter with only a couple of items.`,
      },
    },
  },
  render: () => DefaultFilter({ count: 2 }),
};
