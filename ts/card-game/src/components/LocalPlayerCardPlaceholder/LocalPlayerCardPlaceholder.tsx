import { StreamStateRoundPhase } from '@noice-com/schemas/game-logic/game_logic.pb';
import classNames from 'classnames';
import { HTMLAttributes, useState, useEffect } from 'react';

import styles from './LocalPlayerCardPlaceholder.module.css';

import { usePlayerBoosterApply } from '@game-logic/boosters/hooks';
import { useRoundPhase } from '@game-logic/game/hooks';
import { useCardGameGroup } from '@game-logic/group/hooks';

export interface Props extends HTMLAttributes<HTMLElement> {
  onCardPick?: () => void;
}

export function LocalPlayerCardPlaceholder({ onCardPick, ...props }: Props) {
  const ctaButtonNotAvailable = props['aria-disabled'] || !onCardPick;

  const group = useCardGameGroup();
  const roundPhase = useRoundPhase();
  const { applyModeActive } = usePlayerBoosterApply();
  const showRoundBasedNoCardInfo =
    roundPhase === StreamStateRoundPhase.ROUND_PHASE_COMPETITION ||
    roundPhase === StreamStateRoundPhase.ROUND_PHASE_ENDED;

  const [startCallToAction, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (!group || group.isSolo || ctaButtonNotAvailable) {
      return;
    }

    const animateInterval = setInterval(() => {
      // Trigger pick a card call to action animation every 15 seconds
      setShouldAnimate(true);

      // Remove animation class after 5.4 seconds
      setTimeout(() => {
        setShouldAnimate(false);
      }, 5400);
    }, 15000);

    return () => {
      clearInterval(animateInterval);
    };
  }, [group, ctaButtonNotAvailable]);

  const Element = onCardPick ? 'button' : 'div';

  return (
    <Element
      aria-label={ctaButtonNotAvailable ? 'Pick card' : undefined}
      className={classNames(styles.wrapper, {
        [styles.ctaButton]: !ctaButtonNotAvailable,
        [styles.applyModeActive]: applyModeActive,
        [styles.callToAction]: startCallToAction,
      })}
      onClick={onCardPick}
      {...props}
    >
      <div className={styles.content}>
        <div className={styles.label}>
          {!ctaButtonNotAvailable ? 'Pick card' : 'No card'}
        </div>

        {showRoundBasedNoCardInfo && (
          <p className={styles.info}>
            You can only
            <br />
            select cards
            <br />
            between
            <br />
            rounds
          </p>
        )}
      </div>

      {!ctaButtonNotAvailable && (
        <>
          <div className={classNames(styles.arrowContainer, styles.arrowContainerTop)}>
            <div className={styles.arrow} />
            <div className={styles.arrow} />
            <div className={styles.arrow} />
          </div>

          <div className={classNames(styles.arrowContainer, styles.arrowContainerBottom)}>
            <div className={styles.arrow} />
            <div className={styles.arrow} />
            <div className={styles.arrow} />
          </div>
        </>
      )}
    </Element>
  );
}
