import { GameStoryHelpers, mockGameCard } from '@noice-com/card-game';
import { StoryHelpers } from '@noice-com/common-ui';
import { useEffect, useState } from 'react';

import { StoreItemGameCard, Props } from './StoreItemGameCard';

const card = GameStoryHelpers.getNewGraphQLGameCard();

interface ArgTypes {
  level: number;
}

type WithArgsProps = Props & ArgTypes;

export default {
  title: 'Common/Sellable Item/StoreItemGameCard',
  component: StoreItemGameCard,
  argTypes: {
    // this prevents the large object prop 'card' to take ovee the controls sidebar
    ...StoryHelpers.disableArgs<Props>(['card'], {}),

    level: {
      name: 'Card Level',
      control: {
        type: 'number',
        min: 0,
        max: 50,
        step: 1,
      },
    },
  },
  parameters: StoryHelpers.Apollo.addMocks(mockGameCard()),
};

const WithArgsControls = ({ level, card, ...props }: WithArgsProps) => {
  // Since arg types cannot (in my knowledge) define object properties, we combine
  // those here to the card object
  const args = {
    card: {
      ...card,
      leveling: {
        ...card.leveling,
        currentLevel: level || card.leveling.currentLevel,
      },
    },
    ...props,
  };

  return <StoreItemGameCard {...args} />;
};

export const Default = {
  args: {
    card,
  },
  render: WithArgsControls,
};

export const WithDuplicates = {
  args: {
    card,
    cardCount: 3,
  },
  render: WithArgsControls,
};

const BacksideTemplate = ({ ...args }: WithArgsProps) => {
  const [reveal, setReveal] = useState(!args.showBackside);

  useEffect(() => {
    setReveal(!args.showBackside);
  }, [args.showBackside]);

  const handleOnClick = () => {
    setReveal(!reveal);
  };

  return (
    <WithArgsControls
      {...args}
      showBackside={!reveal}
      onReveal={handleOnClick}
    />
  );
};

export const WithBackside = {
  args: {
    card,
    showBackside: true,
    hasBackside: true,
  },
  render: BacksideTemplate,
};
