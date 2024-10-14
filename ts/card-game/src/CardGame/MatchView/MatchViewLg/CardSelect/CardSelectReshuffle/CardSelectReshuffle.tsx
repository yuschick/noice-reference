import {
  WalletCurrencyId,
  CurrencyButton,
  CurrencyIcon,
  useLoadingPromise,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { useCallback } from 'react';

import styles from './CardSelectReshuffle.module.css';

import { useGameAnalytics } from '@game-common/analytics/hooks';
import { usePlayerReshuffleCost } from '@game-logic/player/hooks';

interface Props {
  className?: string;
}

export function CardSelectReshuffle({ className }: Props) {
  const { sendShuffleUsedEvent } = useGameAnalytics();
  const { currentTokens, nextReshuffleCost, onShuffleClicked } = usePlayerReshuffleCost();

  const onShuffleClickedWithAnalytics = useCallback(async () => {
    await onShuffleClicked();
    sendShuffleUsedEvent();
  }, [sendShuffleUsedEvent, onShuffleClicked]);

  const [shuffleClicked, shufflePending] = useLoadingPromise(
    onShuffleClickedWithAnalytics,
  );

  return (
    <div className={classNames(styles.wrapper, className)}>
      <div className={styles.label}>
        <span>You have</span>
        <CurrencyIcon
          size="sm"
          type={WalletCurrencyId.ReshuffleToken}
        />
        <span className={styles.currentTokens}>{currentTokens}</span>
      </div>

      <div className={styles.reshuffleButton}>
        <CurrencyButton
          cannotAfford={{ displayErrorAsTooltip: currentTokens < nextReshuffleCost }}
          currency={
            nextReshuffleCost === 0
              ? {
                  type: 'free',
                }
              : {
                  type: 'in-game',
                  value: nextReshuffleCost,
                  currency: WalletCurrencyId.ReshuffleToken,
                }
          }
          data-ftue-anchor="reshuffleElement"
          isDisabled={currentTokens < nextReshuffleCost}
          isLoading={shufflePending}
          size="sm"
          onClick={shuffleClicked}
        >
          Reshuffle
        </CurrencyButton>
      </div>
    </div>
  );
}
