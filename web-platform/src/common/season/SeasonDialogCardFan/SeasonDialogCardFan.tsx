import { gql } from '@apollo/client';
import { GameCard } from '@noice-com/card-game';
import classNames from 'classnames';

import styles from './SeasonDialogCardFan.module.css';

import { SeasonDialogCardFanCardFragment } from '@gen';

interface Props {
  cards: SeasonDialogCardFanCardFragment[];
}

export function SeasonDialogCardFan({ cards }: Props) {
  const displayedCards = cards.length < 3 ? cards : cards.slice(0, 3);

  return (
    <div className={styles.cards}>
      {displayedCards.map((card, index) => {
        const isLeft =
          index === 0 && displayedCards.length - 1 && displayedCards.length > 1;
        const isRight = index === displayedCards.length - 1 && displayedCards.length > 1;
        const isSmall = (isLeft || isRight) && displayedCards.length === 3;

        return (
          <div
            className={classNames(styles.cardWrapper, {
              [styles.small]: isSmall,
              [styles.left]: isLeft,
              [styles.right]: isRight,
            })}
            key={`${card.id}-${index}`}
          >
            <GameCard card={card} />
          </div>
        );
      })}
    </div>
  );
}

SeasonDialogCardFan.fragments = {
  entry: gql`
    fragment SeasonDialogCardFanCard on GameLogicCard {
      id
      ...GameCard
    }

    ${GameCard.fragments.card}
  `,
};
