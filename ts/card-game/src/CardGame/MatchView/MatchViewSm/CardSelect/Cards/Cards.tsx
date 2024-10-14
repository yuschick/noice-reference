import classNames from 'classnames';
import { CSSProperties } from 'react';

import styles from './Cards.module.css';
import { useCardsData } from './hooks/useCardsData.hook';

import { CardSelectCardButton } from '@game-common/card/CardSelectCardButton';
import { CARD_DEALING_ANIMATION_DURATION_PER_CARD } from '@game-constants';
import { GameCardFragment } from '@game-gen';

interface Props {
  className?: string;
  cardClassName?: string;
  gridAreaPrefix: string;
  onCardSelected: (card: GameCardFragment) => void;
}

export function Cards({
  gridAreaPrefix,
  className,
  cardClassName,
  onCardSelected,
}: Props) {
  const { cards, disabledCards, loading } = useCardsData();

  if (loading) {
    return (
      <div className={className}>
        {new Array(5).fill(null).map((_, index) => (
          <div
            className={classNames(cardClassName, styles.gameCardButtonWrapper)}
            key={index}
            style={
              {
                gridArea: `${gridAreaPrefix}-${index + 1}`,
                '--card-select-card-item-delay': 0,
              } as CSSProperties
            }
          >
            <CardSelectCardButton.Loading />
          </div>
        ))}
      </div>
    );
  }

  if (!cards.length) {
    return null;
  }

  // We want to force re-render because of cards animation. Just using card id as key might
  // cause card not to re-render when the hand is reshuffled.
  const keyBase = cards.map((card) => card.id).join('-');

  return (
    <div className={className}>
      {cards.map((card, index) => (
        <div
          className={classNames(cardClassName, styles.gameCardButtonWrapper)}
          key={`${keyBase}-${index}`}
          style={
            {
              gridArea: `${gridAreaPrefix}-${index + 1}`,
              '--card-select-card-item-delay': `${
                index * CARD_DEALING_ANIMATION_DURATION_PER_CARD
              }ms`,
            } as CSSProperties
          }
        >
          <CardSelectCardButton
            card={card}
            className={styles.gameCardButton}
            disabled={disabledCards.includes(card.id)}
            onCardSelected={onCardSelected}
          />
        </div>
      ))}
    </div>
  );
}
