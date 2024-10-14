import classNames from 'classnames';
import { CSSProperties } from 'react';

import styles from './CardSelectHand.module.css';
import { useCardSelectHand } from './hooks/useCardSelectHand.hook';

import { CardSelectCardButton } from '@game-common/card/CardSelectCardButton';
import { CARD_DEALING_ANIMATION_DURATION_PER_CARD } from '@game-constants';
import { GameCardFragment } from '@game-gen';

interface Props {
  cardClassName?: string;
  gridAreaPrefix: string;
  onCardSelected: (card: GameCardFragment) => void;
}

export function CardSelectHand({ gridAreaPrefix, cardClassName, onCardSelected }: Props) {
  const { cards, disabledCards, loading } = useCardSelectHand();

  if (loading) {
    return (
      <>
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
      </>
    );
  }

  if (!cards.length) {
    return null;
  }

  // We want to force re-render because of cards animation. Just using card id as key might
  // cause card not to re-render when the hand is reshuffled.
  const keyBase = cards.map((card) => card.id).join('-');

  return (
    <>
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
    </>
  );
}
