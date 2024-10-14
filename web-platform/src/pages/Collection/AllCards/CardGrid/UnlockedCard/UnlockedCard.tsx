import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';

import { CardProgress } from '../../../CardProgress/CardProgress';
import { ChannelIcons } from '../ChannelIcons/ChannelIcons';

import styles from './UnlockedCard.module.css';

import { CardStack } from '@common/card-stack';
import { UnlockedCardGameCardFragment } from '@gen';

gql`
  fragment UnlockedCardGameCard on GameLogicCard {
    id
    seasonId
    ...GameCard
    ...CardProgressCard
    activeStreamerCards {
      ...GameStreamerCard
      channel {
        id
        ...ChannelLogoChannel
      }
    }
  }
`;

interface Props {
  card: UnlockedCardGameCardFragment;
  onClick(cardId: string, channelId: Nullable<string>): void;
}

export function UnlockedCard({ card, onClick }: Props) {
  return (
    <>
      <CardStack
        card={card}
        onClick={onClick}
      />
      <div className={styles.belowCardWrapper}>
        {!!card.activeStreamerCards.length && (
          <ChannelIcons
            channels={card.activeStreamerCards.map(
              (streamerCard) => streamerCard.channel,
            )}
          />
        )}
        <CardProgress card={card} />
      </div>
    </>
  );
}
