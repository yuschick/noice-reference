import { Meta, StoryObj } from '@storybook/react';

import { SeasonRankBadge, seasonRankBadgeSizes } from './SeasonRankBadge';

const meta: Meta<typeof SeasonRankBadge> = {
  title: 'Season Rank Badge',
  component: SeasonRankBadge,
  tags: ['autodocs'],
  args: {
    rank: 10,
  },
  argTypes: {
    rank: {
      control: {
        type: 'number',
      },
      description: 'The rank of the season rank badge.',
    },
    size: {
      control: {
        type: 'select',
        options: seasonRankBadgeSizes,
      },
      defaultValue: 'md',
      description: 'The size of the season rank badge.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `The Season Rank Badge is used to visually communicate the level at which a player is at for any particular game within a season.
        
 **Rank Breakdown:**
        
- 0 < 24 = Low
- 25 > 49 = Medium
- 49 > = High
`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SeasonRankBadge>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: ``,
      },
    },
  },
};
export const Ranks: Story = {
  parameters: {
    docs: {
      description: {
        story: `Every rank style of the Season Rank Badge.`,
      },
    },
  },
  render: () => {
    return (
      <div
        style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <SeasonRankBadge
          rank={5}
          size="lg"
        />
        <SeasonRankBadge
          rank={25}
          size="lg"
        />
        <SeasonRankBadge
          rank={50}
          size="lg"
        />
        <SeasonRankBadge
          rank={75}
          size="lg"
        />

        <SeasonRankBadge
          rank={100}
          size="lg"
        />
      </div>
    );
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: `Every size of the Season Rank Badge.`,
      },
    },
  },
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        <div
          style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
        >
          <SeasonRankBadge
            rank={5}
            size="xl"
          />
          <SeasonRankBadge
            rank={5}
            size="lg"
          />
          <SeasonRankBadge
            rank={5}
            size="md"
          />
          <SeasonRankBadge
            rank={5}
            size="sm"
          />
          <SeasonRankBadge
            rank={5}
            size="xs"
          />
        </div>
        <div
          style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
        >
          <SeasonRankBadge
            rank={25}
            size="xl"
          />
          <SeasonRankBadge
            rank={25}
            size="lg"
          />
          <SeasonRankBadge
            rank={25}
            size="md"
          />
          <SeasonRankBadge
            rank={25}
            size="sm"
          />
          <SeasonRankBadge
            rank={25}
            size="xs"
          />
        </div>
        <div
          style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
        >
          <SeasonRankBadge
            rank={50}
            size="xl"
          />
          <SeasonRankBadge
            rank={50}
            size="lg"
          />
          <SeasonRankBadge
            rank={50}
            size="md"
          />
          <SeasonRankBadge
            rank={50}
            size="sm"
          />
          <SeasonRankBadge
            rank={50}
            size="xs"
          />
        </div>
        <div
          style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
        >
          <SeasonRankBadge
            rank={75}
            size="xl"
          />
          <SeasonRankBadge
            rank={75}
            size="lg"
          />
          <SeasonRankBadge
            rank={75}
            size="md"
          />
          <SeasonRankBadge
            rank={75}
            size="sm"
          />
          <SeasonRankBadge
            rank={75}
            size="xs"
          />
        </div>
        <div
          style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
        >
          <SeasonRankBadge
            rank={100}
            size="xl"
          />
          <SeasonRankBadge
            rank={100}
            size="lg"
          />
          <SeasonRankBadge
            rank={100}
            size="md"
          />
          <SeasonRankBadge
            rank={100}
            size="sm"
          />
          <SeasonRankBadge
            rank={100}
            size="xs"
          />
        </div>
      </div>
    );
  },
};
