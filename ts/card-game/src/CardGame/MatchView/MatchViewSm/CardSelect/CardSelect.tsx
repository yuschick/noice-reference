import {
  Button,
  CurrencyIcon,
  useAuthenticatedUser,
  WalletCurrencyId,
} from '@noice-com/common-ui';
import classNames from 'classnames';

import { Cards } from './Cards';
import styles from './CardSelect.module.css';
import { CardSelectReshuffle } from './CardSelectReshuffle';
import { useCardSelectActions } from './hooks/useCardSelectActions.hook';

import { usePlayerHand, usePlayerReshuffleCost } from '@game-logic/player/hooks';

export function CardSelect() {
  const { userId } = useAuthenticatedUser();
  const { availableMatchCards } = usePlayerHand(userId);
  const { currentTokens } = usePlayerReshuffleCost();

  const { onSelectCard, onClose } = useCardSelectActions();

  return (
    <div
      className={classNames(styles.container, {
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
        <div className={styles.header}>
          <h3 className={styles.title}>Choose new card</h3>

          <div className={styles.label}>
            <span>You have</span>
            <CurrencyIcon
              size="sm"
              type={WalletCurrencyId.ReshuffleToken}
            />
            <span className={styles.currentTokens}>{currentTokens}</span>
          </div>
        </div>

        <Cards
          cardClassName={styles.card}
          className={styles.cards}
          gridAreaPrefix="card"
          onCardSelected={onSelectCard}
        />

        <div className={styles.buttons}>
          <div className={styles.cancel}>
            <Button
              level="secondary"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>

          <CardSelectReshuffle />
        </div>
      </div>
    </div>
  );
}
