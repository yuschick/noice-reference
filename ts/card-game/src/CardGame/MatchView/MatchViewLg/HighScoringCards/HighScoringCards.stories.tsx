import { Button, StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { Nullable } from '@noice-com/utils';
import { Meta, StoryFn } from '@storybook/react';
import { CSSProperties, useCallback, useState } from 'react';

import { HighScoringCardProps, mockHighScoringCard } from './HighScoringCard';
import { HighScoringCards, HighScoringCardsProps } from './HighScoringCards';

import { withGameState } from '@game-story-helpers';
import { BoosterType } from '@game-types';

const CARD_ID = '21';
const STREAMER_CARD_ID = '22';
const PLAYER_ID = 'me';
const GROUP_ID = 'group-id';

const mockMatchGroup = new MockMatchGroup(GROUP_ID, PLAYER_ID);

export default {
  title: 'MatchViewLg/High Scoring Card/High Scoring Cards',
  component: HighScoringCards,
  argTypes: {
    currentItem: StoryHelpers.disableArg(),
  },
  decorators: [withGameState(mockMatchGroup)],
} as Meta<typeof HighScoringCards>;

const wrapperStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
} as CSSProperties;

const overflowStyles = {
  width: '100%',
  paddingLeft: '150px',
  paddingRight: '150px',
  paddingTop: '100px',
  overflow: 'hidden',
} as CSSProperties;

const normalItem: HighScoringCardProps = {
  playerId: PLAYER_ID,
  groupId: GROUP_ID,
  boosterIds: [BoosterType.LetsGo, BoosterType.GoodCall],
  cardId: CARD_ID,
  points: 2000,
  isPromoted: false,
  countdownDuration: 5000,
};

const streamerCardItem: HighScoringCardProps = {
  ...normalItem,
  cardId: STREAMER_CARD_ID,
};

const promotedCardItem: HighScoringCardProps = {
  ...normalItem,
  isPromoted: true,
};

const Template: StoryFn<HighScoringCardsProps> = ({ ...args }) => {
  const [currentCard, setCurrentCard] = useState<Nullable<HighScoringCardProps>>(null);
  const [currentId, setCurrentId] = useState<string>('');

  const handleQueue = useCallback((item: HighScoringCardProps) => {
    setCurrentCard(item);
    setCurrentId(item.cardId);
  }, []);

  const promoteCurrent = useCallback(
    (item: HighScoringCardProps) => {
      if (!currentCard) {
        return;
      }

      setCurrentCard({
        ...item,
        cardId: currentId,
      });
    },
    [currentId, currentCard],
  );

  const reset = useCallback(() => {
    setCurrentCard(null);
    setCurrentId('');
  }, []);

  return (
    <div style={wrapperStyles}>
      <div style={overflowStyles}>
        <HighScoringCards
          {...args}
          currentCard={currentCard}
          onCompleted={reset}
        />
      </div>
      <Button onClick={() => handleQueue(normalItem)}>Add normal card to queue</Button>
      <Button onClick={() => handleQueue(streamerCardItem)}>
        Add streamer card to queue
      </Button>
      <Button onClick={() => handleQueue(promotedCardItem)}>
        Add promoted card to queue
      </Button>
      <Button
        onClick={() => {
          if (!currentCard) {
            return;
          }

          promoteCurrent({ ...currentCard, isPromoted: true });
        }}
      >
        Promote current card
      </Button>
    </div>
  );
};

export const Default = {
  render: Template,

  parameters: {
    ...StoryHelpers.Apollo.addMocks([
      ...mockHighScoringCard({
        cardId: CARD_ID,
        playerId: PLAYER_ID,
      }),
      ...mockHighScoringCard({
        cardId: STREAMER_CARD_ID,
        playerId: PLAYER_ID,
        isStreamerCard: true,
      }),
    ]),
  },

  args: {
    currentCard: null,
  },
};
