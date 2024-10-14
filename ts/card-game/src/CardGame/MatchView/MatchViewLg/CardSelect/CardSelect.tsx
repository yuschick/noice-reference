import {
  Button,
  KeyboardKeys,
  useAuthenticatedUser,
  useKeyPress,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { useState } from 'react';

import styles from './CardSelect.module.css';
import { CardSelectActiveCard } from './CardSelectActiveCard';
import { CardSelectHand } from './CardSelectHand';
import { CardSelectReshuffle } from './CardSelectReshuffle';
import { useCardSelectActions } from './hooks/useCardSelectActions.hook';
import { MatchCards } from './MatchCards';

import { usePlayerHand } from '@game-logic/player/hooks';

export function CardSelect() {
  const { userId } = useAuthenticatedUser();
  const { availableMatchCards } = usePlayerHand(userId);
  const { onSelectCard, onClose } = useCardSelectActions();
  const [highlightMatchCards, onMatchCardToggle] = useState(false);

  useKeyPress(KeyboardKeys.Escape, onClose);

  return (
    <div
      className={classNames(styles.cardSelectRoot, {
        [styles.highlightMatchCards]: highlightMatchCards,
        [styles.matchCardsAvailable]: !!availableMatchCards.length,
      })}
    >
      <div
        aria-hidden="true"
        className={styles.dismiss}
        onClick={onClose}
      />
      <div
        className={styles.content}
        data-ftue-anchor="card-select"
      >
        <h3 className={styles.title}>Choose new card</h3>

        <MatchCards
          matchCardsClassName={styles.matchCards}
          matchCardsLabelClassName={styles.matchCardsLabel}
          onCardSelected={onSelectCard}
          onMatchCardToggle={onMatchCardToggle}
        />
        <CardSelectHand
          cardClassName={styles.handCard}
          gridAreaPrefix="hand-card"
          onCardSelected={onSelectCard}
        />
        <CardSelectActiveCard className={styles.activeCard} />
        <CardSelectReshuffle className={styles.reshuffle} />
        <div className={styles.cancelButton}>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
