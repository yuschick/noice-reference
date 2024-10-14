import { CoreAssets } from '@noice-com/assets-core';
import { StoryHelpers } from '@noice-com/common-ui';
import { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';

import { GameCard } from './GameCard';
import styles from './GameCard.stories.module.css';
import { GameCardProps } from './GameCard.types';
import { GameCardInfo, GameCardInfoProps } from './GameCardInfo';
import { GameCardPoints, GameCardPointsProps } from './GameCardPoints';
import { mockGameCard } from './mocks';

import { RarityRarity } from '@game-gen';
import {
  getNewGraphQLGameCard,
  getNewGraphQLGameStreamerCard,
} from '@game-story-helpers';

interface ArgTypes {
  rarity: RarityRarity;
  isAllOrNothing: boolean;
  isMatchCard: boolean;
  isStreamerCard: boolean;
  level: number;
  cardSize: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | 'auto';
  loading?: boolean;
  heroArt?: string;
}

type WithArgsProps = GameCardProps & ArgTypes;

const INITIAL_TIMER_DURATION = 60;

const card = {
  ...getNewGraphQLGameCard(),
  description: `Open {targetValue} chests in {timerDuration} seconds`,
  targetValue: 3,
  timerDuration: INITIAL_TIMER_DURATION,
};

const streamerCard = {
  ...card,
  activeStreamerCard: {
    ...getNewGraphQLGameStreamerCard(),
    image: CoreAssets.Images.CardFrame,
  },
};

export default {
  title: 'GameCard',
  component: GameCard,
  argTypes: {
    // this prevents the large object prop 'card' to take ovee the controls sidebar
    ...StoryHelpers.disableArgs<GameCardProps>(['card'], {}),

    rarity: {
      name: 'Card Rarity',
      defaultValue: RarityRarity.RarityCommon,
      options: Object.values(RarityRarity),
      control: {
        type: 'select',
        labels: {
          [RarityRarity.RarityCommon]: 'Common',
          [RarityRarity.RarityUncommon]: 'Uncommon',
          [RarityRarity.RarityRare]: 'Rare',
          [RarityRarity.RarityEpic]: 'Epic',
          [RarityRarity.RarityLegendary]: 'Legendary',
        },
      },
    },
    isAllOrNothing: {
      name: 'All or Nothing',
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    isMatchCard: {
      name: 'Match Card',
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    level: {
      name: 'Card Level',
      control: {
        type: 'number',
        min: 0,
        max: 50,
        step: 1,
      },
    },
    heroArt: {
      name: 'Hero Art Url',
      options: [
        `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/win_match_card.png`,
        `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/score_no_shotgun.png`,
        `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/smg_score.png`,
        `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/score_distance_medium.png`,
        `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/multiple_assits_before_score.png`,
        `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/no_dmg_before_storm.png`,
        `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/pickaxe_score.png`,
        `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/shield_health_full.png`,
        `---`,
        `${NOICE.CDN_URL}/card-hero-art/apex_legends/season_zero/heavy_score.png`,
        `${NOICE.CDN_URL}/card-hero-art/apex_legends/season_zero/deal_dmg_in_duration.png`,
        `${NOICE.CDN_URL}/card-hero-art/apex_legends/season_zero/collect_material_before_score.png`,
        `${NOICE.CDN_URL}/card-hero-art/apex_legends/season_zero/remain_kill_leader_for.png`,
        `${NOICE.CDN_URL}/card-hero-art/apex_legends/season_zero/crafter_before_duration.png`,
      ],
      control: {
        type: 'select',
      },
    },
    isStreamerCard: {
      name: '(For testing) is Streamer Card',
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    cardSize: {
      name: 'Card size',
      control: 'select',
      defaultValue: 'large',
      options: ['xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'],
    },
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `The GameCard component handles the rendering of a game card. It just receives the card data in the 'card' property and renders it.
        
The GameCard itself does queries to fetch season configs so in storybook you need to use <code>mockGameCard</code> to render it correctly. 

Card takes size according to parents <code>inline-size</code>.

In production code in simplest usecase you can just give it the data and it will render the card:

    return (
      <GameCard card={card} />;
    )`,
      },
    },
    ...StoryHelpers.Apollo.addMocks(mockGameCard()),
  },
} as Meta<WithArgsProps>;

type Story = StoryObj<WithArgsProps>;

const WithArgsControls = ({
  rarity,
  isAllOrNothing,
  isMatchCard,
  isStreamerCard,
  level,
  heroArt,
  card,
  cardSize,
  loading,
  ...props
}: WithArgsProps) => {
  // Since arg types cannot (in my knowledge) define object properties, we combine
  // those here to the card object
  const args = {
    card: {
      ...(isStreamerCard ? streamerCard : card),
      rarity: rarity || card.rarity,
      isAllOrNothing: isAllOrNothing || card.isAllOrNothing,
      isMatchCard: isMatchCard || card.isMatchCard,
      leveling: {
        ...card.leveling,
        currentLevel: level || card.leveling.currentLevel,
      },
      icon: heroArt || card.icon,
    },
    ...props,
  };

  return (
    <div
      style={
        cardSize !== 'auto'
          ? { inlineSize: `var(--game-card-width-breakpoint-${cardSize ?? 'large'})` }
          : undefined
      }
    >
      {loading ? <GameCard.Loading /> : <GameCard {...args} />}
    </div>
  );
};

export const Default: Story = {
  args: {
    card,
  },
  render: WithArgsControls,
  parameters: {
    docs: {
      description: {
        story: `The simplest usecase:

    return (
      <GameCard card={card} />;
    )`,
      },
    },
  },
};

export const StreamerCard: Story = {
  args: {
    card: streamerCard,
  },
  render: WithArgsControls,
  parameters: {
    docs: {
      description: {
        story: `If you use the <code>GameCard</code> fragment with e.g. <code>listGameCards</code> endpoint and the fetched card is a streamer card,
it will render automatically as streamer card. 

    return (
      <GameCard card={card} />;
    )

With some endpoints you need to use <code>GameStreamerCard</code> and <code>GameStreamerBaseCard</code> fragments to get the streamer card data. Then you 
just need to make sure that the data from <code>GameStreamerCard</code> fragment is set to <code>activeStreamerCard</code> property in the card data.

    return (
      <GameCard card={{...baseCardData, activeStreamerCard: streamerData }} />;
    )`,
      },
    },
  },
};

export const MatchCard: Story = {
  args: {
    card: {
      ...card,
      isMatchCard: true,
    },
  },
  render: WithArgsControls,
  parameters: {
    docs: {
      description: {
        story: `If card data has <code>isMatchCard</code> property set to true, it will render as match card.`,
      },
    },
  },
};

export const AllOrNothing: Story = {
  args: {
    card: {
      ...card,
      isAllOrNothing: true,
    },
  },
  render: WithArgsControls,
  parameters: {
    docs: {
      description: {
        story: `If card data has <code>isAllOrNothing</code> property set to true, it will render as match card.`,
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    card: card,
    isDisabled: true,
  },
  render: WithArgsControls,
  parameters: {
    docs: {
      description: {
        story: `If card data has <code>isDisabled</code> property set to true, it will render as disabled.

    return (
      <GameCard card={card} isDisabled />;
    )`,
      },
    },
  },
};

export const Loading: Story = {
  args: {
    card: {
      ...card,
      isAllOrNothing: true,
    },
  },
  render: (args: WithArgsProps) => (
    <WithArgsControls
      {...args}
      loading
    />
  ),
  parameters: {
    docs: {
      description: {
        story: `If you need to render loading placeholder for the card.

    return (
      <GameCard.Loading />;
    )`,
      },
    },
  },
};

export const AllSizes: Story = {
  name: 'All Sizes',
  args: {
    card,
  },
  render: (args: WithArgsProps) => (
    <div className={styles.allSizesRow}>
      <WithArgsControls
        {...args}
        cardSize="xsmall"
      />

      <WithArgsControls
        {...args}
        cardSize="small"
      />

      <WithArgsControls
        {...args}
        cardSize="medium"
      />

      <WithArgsControls
        {...args}
        cardSize="large"
      />

      <WithArgsControls
        {...args}
        cardSize="xlarge"
      />

      <WithArgsControls
        {...args}
        cardSize="xxlarge"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Just a helper story to get overview of all of the sizes.`,
      },
    },
  },
};

export const AllLevels: Story = {
  name: 'All Levels',
  args: {
    card,
  },
  render: (args: WithArgsProps) => (
    <div className={styles.allSizesRow}>
      <div className={styles.large}>
        <WithArgsControls
          {...args}
          level={1}
        />
      </div>
      <WithArgsControls
        {...args}
        heroArt={`${NOICE.CDN_URL}/card-hero-art/apex_legends/season_zero/heavy_score.png`}
        level={2}
      />
      <WithArgsControls
        {...args}
        heroArt={`${NOICE.CDN_URL}/card-hero-art/apex_legends/season_zero/heavy_score.png`}
        level={10}
      />
      <WithArgsControls
        {...args}
        heroArt={`${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/shield_health_full.png`}
        level={20}
      />
      <WithArgsControls
        {...args}
        heroArt={`${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/score_no_shotgun.png`}
        level={30}
      />
      <WithArgsControls
        {...args}
        heroArt={`${NOICE.CDN_URL}/card-hero-art/apex_legends/season_zero/crafter_before_duration.png`}
        level={40}
      />
      <WithArgsControls
        {...args}
        heroArt={`${NOICE.CDN_URL}/card-hero-art/apex_legends/season_zero/remain_kill_leader_for.png`}
        level={50}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Card visuals change according to the level of the card. Here is the overview of all of the different level styles`,
      },
    },
  },
};

export const HoverExample: Story = {
  args: {
    card,
  },
  render: (args: WithArgsProps) => (
    <div className={styles.hoverContainer}>
      <WithArgsControls
        {...args}
        cardSize="auto"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Example of resizing card on hover. It is done by changing <code>inline-size</code> of the parent element.`,
      },
    },
  },
};

export const FullSize: Story = {
  args: {
    card,
  },
  render: (args: WithArgsProps) => (
    <div className={styles.dynamicSize}>
      <WithArgsControls
        {...args}
        cardSize="auto"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Story of no size limits to so that can test size changes in responsive mode`,
      },
    },
  },
};

const IncreasingPoints = (props: GameCardPointsProps) => {
  const { card } = props;
  const { pointsMin, pointsMax } = card;

  const [points, setPoints] = useState(pointsMin);

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints((prev) => {
        const newPoints = prev + 80;
        if (newPoints > pointsMax) {
          clearInterval(interval);
          return pointsMax;
        }

        return newPoints;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [pointsMin, pointsMax]);

  return (
    <GameCardPoints
      {...props}
      card={{
        ...card,
        pointsMin: points,
      }}
    />
  );
};

export const SlotsPoints: Story = {
  name: 'Example: Custom points rendering',
  args: {
    card: {
      ...card,
      pointsMin: 80,
      pointsMax: 1540,
    },
  },
  render: (args: WithArgsProps) => {
    return (
      <div style={{ inlineSize: `var(--game-card-width-breakpoint-large` }}>
        <GameCard
          {...args}
          slots={{
            points: ({ card, ...restProps }: GameCardPointsProps) => (
              <IncreasingPoints
                {...restProps}
                card={card}
              />
            ),
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `To keep performance good and also separating concerns, the card slots are a way to give support to update
the dynamic parts of the card without having to re-render the whole card. That would naturally happen if e.g. updated points would be given
on every change with the top level card data. But with the points slots we can update the points during the game and cause only 
the points slots to re-render.

    return (
      <GameCard
        card={card}
        slots={{
          points: ({ card, ...restProps }: GameCardPointsProps) => (
            <IncreasingPoints
              {...restProps}
              card={card}
            />
          ),
        }}
      />
    )`,
      },
    },
  },
};

const UpdatingInfo = ({ card, ...restOfProps }: GameCardInfoProps) => {
  const { timerDuration } = card;

  const [newTimerDuration, setTimerDuration] = useState(timerDuration);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerDuration((prev) => {
        const newTimer = prev - 1;
        if (newTimer === 0) {
          clearInterval(interval);
          return newTimer;
        }

        return newTimer;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GameCardInfo
      {...restOfProps}
      card={{
        ...card,
        timerDuration: newTimerDuration,
      }}
    />
  );
};

export const SlotsInfo: Story = {
  name: 'Example: Custom info rendering',
  args: {
    card: {
      ...card,
      pointsMin: 80,
      pointsMax: 1540,
    },
  },
  render: (args: WithArgsProps) => {
    return (
      <div style={{ inlineSize: `var(--game-card-width-breakpoint-large` }}>
        <GameCard
          {...args}
          card={{
            ...card,
            name: 'Little birdies',
            description: 'Hit a survivor within {timerDuration}s of using swarm',
          }}
          slots={{
            info: ({ card }: GameCardInfoProps) => <UpdatingInfo card={card} />,
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `Here is an example of updating the info with info slot. Check the reasoning behind it from the previous points slots story.

    return (
      <GameCard
        card={card}
        slots={{
          info: ({ card }: GameCardInfoProps) => <UpdatingInfo card={card} />,
        }}
      />
    )`,
      },
    },
  },
};
