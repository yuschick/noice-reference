import { gql } from '@apollo/client';
import { GameCard } from '@noice-com/card-game';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';

import { isReactNativeWebView } from '../../../../embeds/bridge';

import styles from './CreatorCardGrid.module.css';

import { CreatorCardGridStreamerCardFragment } from '@gen';

gql`
  fragment CreatorCardGridStreamerCard on GameLogicStreamerCard {
    ...GameStreamerCard

    baseCard(season_id: $seasonId) {
      ...GameCard
      activeStreamerCards {
        ...GameStreamerCard
      }
    }
  }
`;

interface Props {
  cards: Nullable<CreatorCardGridStreamerCardFragment[]>;
  ownedCards: Nullable<string[]>;
  onSelectCreatorCard(cardId: string): void;
}

export function CreatorCardGrid({ cards, ownedCards, onSelectCreatorCard }: Props) {
  const isEmbedded = isReactNativeWebView();

  return (
    <div className={styles.grid}>
      {cards &&
        cards.map((card) => {
          const isCardOwned = ownedCards?.includes(card.id);

          return (
            <div
              className={classNames(styles.gridItem, { [styles.locked]: !isCardOwned })}
              key={card.id}
            >
              <GameCard
                as="button"
                card={{ ...card.baseCard, activeStreamerCard: card }}
                playVideoInline={isEmbedded}
                onClick={() => onSelectCreatorCard(card.id)}
              />
            </div>
          );
        })}
    </div>
  );
}
