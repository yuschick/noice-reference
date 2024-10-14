import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';

import { useMatchCards } from './hooks/useMatchCards.hook';
import styles from './MatchCards.module.css';

import { CardSelectCardButton } from '@game-common/card/CardSelectCardButton';
import { GameCardFragment } from '@game-gen';

interface Props {
  matchCardsClassName?: string;
  matchCardsLabelClassName?: string;
  onCardSelected(card: GameCardFragment): void;
  onMatchCardToggle(show: boolean): void;
}

export function MatchCards({
  matchCardsClassName,
  matchCardsLabelClassName,
  onCardSelected,
  onMatchCardToggle,
}: Props) {
  const { matchCards, disabledCards } = useMatchCards(onMatchCardToggle);

  const [hoverCards, setHoverCards] = useState(false);

  const onMouseEnter = useCallback(() => {
    setHoverCards(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setHoverCards(false);
  }, []);

  const onFocus = useCallback(() => {
    setHoverCards(true);
  }, []);

  const onBlur = useCallback(() => {
    setHoverCards(false);
  }, []);

  useEffect(() => {
    onMatchCardToggle(hoverCards);
  }, [onMatchCardToggle, hoverCards]);

  if (!matchCards.length) {
    return null;
  }

  return (
    <>
      <div
        className={classNames(matchCardsClassName, styles.wrapper, {
          [styles.hoverCards]: hoverCards,
        })}
        data-ftue-anchor="match-card-container"
      >
        <div className={styles.content}>
          <div
            className={styles.cardRow}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            {matchCards.map((card, i) => (
              <CardSelectCardButton
                card={card}
                className={classNames({
                  [styles.firstMatchCard]: i === 0,
                  [styles.secondMatchCard]: i === 1,
                })}
                disabled={disabledCards.includes(card.id)}
                key={card.id}
                onBlur={onBlur}
                onCardSelected={onCardSelected}
                onFocus={onFocus}
              />
            ))}
          </div>
        </div>
        <div className={styles.separatorWrapper}>
          <span className={styles.separator} />
        </div>
      </div>
      <div className={classNames(styles.labelWrapper, matchCardsLabelClassName)}>
        <span className={styles.bold}>Match Cards</span>
        <br />
        Now available!
      </div>
    </>
  );
}
