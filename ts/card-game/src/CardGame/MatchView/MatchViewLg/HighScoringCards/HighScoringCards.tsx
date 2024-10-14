import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

import { HighScoringCard, HighScoringCardProps } from './HighScoringCard';
import styles from './HighScoringCards.module.css';
import { CardState } from './types';

// This function is called for both the current and previous card every time
// the component is re-rendered. It returns a state where the card should be
// forced into.
const getForcedState = (
  item: HighScoringCardProps,
  previous: Nullable<HighScoringCardProps>,
): CardState | undefined => {
  // If the previous card is promoted, return an undefined forced state. This
  // check will keep a promoted card that is in the previous -slot visible until
  // it has disappeared
  if (previous?.isPromoted) {
    return;
  }

  // If the checked card is not promoted and it matches to being the card in the
  // previous slot, make it disappear
  if (!item.isPromoted && item.cardId === previous?.cardId) {
    return 'disappear';
  }

  return 'appear';
};

export interface HighScoringCardsProps {
  currentCard: Nullable<HighScoringCardProps>;
  onCompleted?(): void;
}

export function HighScoringCards({ currentCard, onCompleted }: HighScoringCardsProps) {
  const [current, setCurrent] = useState<
    [Nullable<HighScoringCardProps>, Nullable<HighScoringCardProps>]
  >([null, null]);
  const [wrapperState, setWrapperState] = useState<'hidden' | 'visible'>('visible');

  // Effect for when the currentCard changes
  useEffect(() => {
    setCurrent(([prevPrevious, prevCurrent]) => {
      // If for some reason the currentCard is null, reset both of the cards (previous and current)
      if (!currentCard) {
        return [null, null];
      }

      // If the previous card is promoted then keep it as the previous and just replace the current one.
      // This is for the edge case where if we are showing a promoted card, but there is a new ghost
      // card or a new promoted card we keep the latest one as the current to be shown right after
      // the visible promoted card (prevPrevious) has disappeared.
      if (prevPrevious?.isPromoted) {
        return [prevPrevious, currentCard];
      }

      // If the new currentCard (the card promotion message is a new currentCard) is promoted
      // and the current (prevCurrent) card id matches the new currentCard then promote the
      // visible card.
      const currentVisibleCard = prevCurrent;

      if (currentCard.isPromoted && currentVisibleCard?.cardId === currentCard.cardId) {
        if (currentVisibleCard?.cardId === currentCard.cardId) {
          return [
            prevPrevious,
            {
              ...currentVisibleCard,
              isPromoted: true,
            },
          ];
        }
      }

      // Default behaviour is to swap the current card as the previous and make the new currentCard
      // the current.
      // NOTE: Even when the current one is promoted it is swapped to previous slot, but kept visually
      // as the "current" by other parts of the implementation until it has disappeared, mainly by the
      // second "if" -statement in this effect and "getForcedState" function.
      return [prevCurrent, currentCard];
    });
  }, [currentCard]);

  // Callbacks

  const onHighScoringCardCompleted = (cardId: string) => {
    const [prev, cur] = current;

    // If the current card is the one to complete then the whole setup is completed
    if (cur?.cardId === cardId) {
      onCompleted?.();
    }
    // This is an edge case. If the completed card was the one in previous slot, and it
    // was promoted then set it to null and set the current one still as the current one.
    // This allows the one that was being kept as the next one to appear.
    else if (prev?.cardId === cardId && prev.isPromoted) {
      setCurrent([null, cur]);
    }
  };

  // Effects

  useEffect(() => {
    if (current[0] || current[1]) {
      setWrapperState('visible');
    } else {
      setWrapperState('hidden');
    }
  }, [current]);

  if (!current[0] && !current[1]) {
    return null;
  }

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.visible]: wrapperState === 'visible',
        [styles.hidden]: wrapperState === 'hidden',
      })}
    >
      {current.map((item, index) => {
        if (!item) {
          return null;
        }

        return (
          <div
            className={styles.cardWrapper}
            key={`card_${item.cardId}_${index}`}
          >
            <HighScoringCard
              {...item}
              forceState={getForcedState(item, current[0])}
              onCompleted={onHighScoringCardCompleted}
            />
          </div>
        );
      })}
    </div>
  );
}
