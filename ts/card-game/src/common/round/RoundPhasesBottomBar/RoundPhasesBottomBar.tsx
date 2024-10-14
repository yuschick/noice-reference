import {
  useAuthenticatedUser,
  useContainerSize,
  usePreviousValue,
} from '@noice-com/common-ui';
import { StreamStateRoundPhase } from '@noice-com/schemas/game-logic/game_logic.pb';
import classNames from 'classnames';
import { CSSProperties, useEffect, useRef, useState } from 'react';

import { useRoundPreparationState, useRoundStartedAnalytics } from './hooks';
import { RoundEndedBottomBarContent } from './RoundEndedBottomBarContent';
import styles from './RoundPhasesBottomBar.module.css';

import { AnimatedLabel } from '@game-common/game';
import { usePlayerActiveCard } from '@game-logic/card/hooks';
import { useRoundPhase } from '@game-logic/game/hooks';

const BOTTOM_BAR_HIDE_SHOW_ANIMATION_DELAY = 2000;
const BOTTOM_BAR_HIDE_SHOW_ANIMATION_DURATION = 200;

export function RoundPhasesBottomBar() {
  const { userId } = useAuthenticatedUser();
  const rootRef = useRef<HTMLDivElement>(null);

  const activeCard = usePlayerActiveCard(userId);
  const roundPhase = useRoundPhase();
  const prevPhase = usePreviousValue(roundPhase);
  useRoundStartedAnalytics();

  const [hideFromDom, setHideFromDom] = useState(
    () =>
      // If we initially render in the middle of competition phase
      roundPhase === StreamStateRoundPhase.ROUND_PHASE_COMPETITION &&
      (prevPhase === StreamStateRoundPhase.ROUND_PHASE_COMPETITION ||
        prevPhase === StreamStateRoundPhase.ROUND_PHASE_UNSPECIFIED),
  );

  // container size query
  const { inlineSize } = useContainerSize(rootRef);

  // preparation phase countdown
  const { secondsLeft, timeLeftClassNameKey, timeLeftPercentage, isCountingDown } =
    useRoundPreparationState();

  // Clean up the bottom bar from dom when not needed
  useEffect(() => {
    if (roundPhase !== StreamStateRoundPhase.ROUND_PHASE_COMPETITION) {
      setHideFromDom(false);
      return;
    }

    const timeout = setTimeout(() => {
      setHideFromDom(true);
    }, BOTTOM_BAR_HIDE_SHOW_ANIMATION_DELAY + BOTTOM_BAR_HIDE_SHOW_ANIMATION_DURATION);

    return () => {
      clearTimeout(timeout);
    };
  }, [roundPhase]);

  if (hideFromDom) {
    return null;
  }

  const showTimebar = secondsLeft < 15;

  return (
    <div
      className={classNames(styles.gameStateBottomBarRoot, styles[timeLeftClassNameKey], {
        [styles.hasActiveCard]: !!activeCard,
        [styles.timebarVisible]: showTimebar,
        [styles.roundStarting]:
          roundPhase === StreamStateRoundPhase.ROUND_PHASE_COMPETITION,
        [styles.roundEnded]: roundPhase === StreamStateRoundPhase.ROUND_PHASE_ENDED,
      })}
      ref={rootRef}
      style={
        {
          '--bottom-bar-hide-show-animation-delay': `${BOTTOM_BAR_HIDE_SHOW_ANIMATION_DELAY}ms`,
          '--bottom-bar-hide-show-animation-duration': `${BOTTOM_BAR_HIDE_SHOW_ANIMATION_DURATION}ms`,
        } as CSSProperties
      }
    >
      <div className={styles.effectWrapper}>
        <div className={styles.backgroundGradientEffect} />
      </div>

      {roundPhase === StreamStateRoundPhase.ROUND_PHASE_ENDED && (
        <RoundEndedBottomBarContent />
      )}

      {(roundPhase === StreamStateRoundPhase.ROUND_PHASE_PREPARATION ||
        roundPhase === StreamStateRoundPhase.ROUND_PHASE_COMPETITION) && (
        <div>
          {roundPhase === StreamStateRoundPhase.ROUND_PHASE_COMPETITION ? (
            <div className={styles.gameStateLabelContainer}>
              <AnimatedLabel
                className={styles.gameStateLabel}
                text="Round Started"
              />
            </div>
          ) : isCountingDown ? (
            <>
              <div
                className={styles.preparationTimebar}
                style={
                  {
                    '--preparation-timebar-value-percentage': `${timeLeftPercentage}%`,
                  } as CSSProperties
                }
              />
              <p className={styles.countDownText}>
                Card selecting in progress, closing in{' '}
                <span
                  className={styles.roundEndedBottomBarHighlightText}
                  style={
                    {
                      '--countdown-number': `"${secondsLeft}"`,
                    } as CSSProperties
                  }
                >
                  {secondsLeft}
                </span>
                <span className={styles.roundEndedBottomBarHighlightText}>
                  {inlineSize && inlineSize > 460 ? ' seconds' : 's'}
                </span>
              </p>
            </>
          ) : (
            <p className={styles.countDownText}>
              Card selecting in progress,{' '}
              <span className={styles.roundEndedBottomBarHighlightText}>closing...</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
